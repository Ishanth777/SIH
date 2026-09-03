import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from '../common/prisma';

@Injectable()
export class ForecastingService {
  private readonly logger = new Logger(ForecastingService.name);
  private readonly forecastApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    // Default to docker-compose service name if not set
    this.forecastApiUrl = this.configService.get<string>('FORECASTING_API_URL') || 'http://forecasting:8000';
  }

  async getForecastForCooperative(cooperativeId: string, days: number = 7) {
    // Verify cooperative exists
    const cooperative = await this.prisma.cooperativeSociety.findUnique({
      where: { id: cooperativeId },
    });
    
    if (!cooperative) {
      throw new HttpException('Cooperative not found', HttpStatus.NOT_FOUND);
    }

    try {
      this.logger.log(`Fetching forecast from Python microservice for coop ${cooperativeId}`);
      const response = await lastValueFrom(
        this.httpService.post(`${this.forecastApiUrl}/forecast`, {
          cooperativeId,
          days,
        }),
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to fetch forecast: ${error.message}`);
      throw new HttpException(
        'Forecasting service is currently unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
