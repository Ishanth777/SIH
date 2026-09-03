import { Controller, Get, Param, Query, UseGuards, ParseUUIDPipe, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ForecastingService } from './forecasting.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { ForecastResponseDto } from './dto/forecast-response.dto';

@ApiTags('forecasting')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('forecasting')
export class ForecastingController {
  constructor(private readonly forecastingService: ForecastingService) {}

  @Get('cooperatives/:cooperativeId')
  @Roles('FEDERATION_ADMIN', 'SOCIETY_ADMIN')
  @ApiOperation({ summary: 'Get demand forecast for a specific cooperative' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of forecast days (1-30)' })
  @ApiResponse({
    status: 200,
    description: 'Demand forecast retrieved successfully (or fallback baseline per Rule A3)',
    type: [ForecastResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Cooperative not found' })
  getForecast(
    @Param('cooperativeId', ParseUUIDPipe) cooperativeId: string,
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
  ): Promise<ForecastResponseDto[]> {
    return this.forecastingService.getForecastForCooperative(cooperativeId, days);
  }
}
