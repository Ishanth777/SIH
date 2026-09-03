import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from '../common/prisma';
import { ForecastResponseDto, CategoryForecastDto } from './dto/forecast-response.dto';
import type { EnvConfig } from '../common/config/env.validation';

const DEFAULT_SERVICE_CATEGORIES = ['ELECTRICIAN', 'PLUMBER', 'CLEANER', 'CAREGIVER'];

@Injectable()
export class ForecastingService {
  private readonly logger = new Logger(ForecastingService.name);
  private readonly forecastApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvConfig, true>,
    private readonly prisma: PrismaService,
  ) {
    this.forecastApiUrl =
      this.configService.get('FORECASTING_SERVICE_URL', { infer: true }) ||
      this.configService.get('FORECASTING_API_URL' as any) ||
      'http://localhost:8000';
  }

  async getForecastForCooperative(
    cooperativeId: string,
    days: number = 7,
  ): Promise<ForecastResponseDto[]> {
    // Verify cooperative exists
    const cooperative = await this.prisma.cooperativeSociety.findUnique({
      where: { id: cooperativeId },
    });

    if (!cooperative) {
      throw new HttpException('Cooperative not found', HttpStatus.NOT_FOUND);
    }

    try {
      this.logger.log(
        `Fetching demand forecast from Python microservice (${this.forecastApiUrl}) for coop ${cooperativeId}`,
      );

      const response = await lastValueFrom(
        this.httpService.post<ForecastResponseDto[]>(
          `${this.forecastApiUrl}/forecast`,
          {
            cooperativeId,
            days,
          },
          { timeout: 5000 },
        ),
      );

      return response.data.map((item) => ({
        ...item,
        isFallback: false,
      }));
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `[Rule A3 Graceful Degradation] Python forecasting microservice unavailable (${errMsg}). Using deterministic baseline forecast fallback.`,
      );

      // Rule A3: Platform continues functioning normally when AI service is down
      return this.generateDeterministicFallbackForecast(days);
    }
  }

  /**
   * Deterministic baseline heuristic fallback when the Python AI service is down.
   * Ensures admin dashboards, staffing projections, and UI widgets remain fully operational.
   */
  private generateDeterministicFallbackForecast(days: number): ForecastResponseDto[] {
    const results: ForecastResponseDto[] = [];
    const today = new Date();

    const baselineMap: Record<string, number> = {
      ELECTRICIAN: 18,
      PLUMBER: 15,
      CLEANER: 25,
      CAREGIVER: 16,
    };

    for (let i = 0; i < days; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      const dateStr = targetDate.toISOString().split('T')[0] || '';
      const dayOfWeek = targetDate.getDay(); // 0 is Sunday, 6 is Saturday

      const forecasts: CategoryForecastDto[] = DEFAULT_SERVICE_CATEGORIES.map((category) => {
        let multiplier = 1.0;
        if (category === 'CLEANER' && (dayOfWeek === 0 || dayOfWeek === 6)) {
          multiplier = 1.4; // Weekend surge
        } else if (category === 'ELECTRICIAN' && (dayOfWeek === 2 || dayOfWeek === 3)) {
          multiplier = 1.15; // Midweek surge
        }

        return {
          category,
          expectedDemand: Math.round((baselineMap[category] ?? 15) * multiplier),
          confidenceScore: 0.75, // Baseline heuristic confidence
        };
      });

      results.push({
        date: dateStr,
        forecasts,
        isFallback: true,
      });
    }

    return results;
  }
}
