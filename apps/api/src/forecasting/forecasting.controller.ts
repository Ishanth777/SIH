import { Controller, Get, Param, Query, UseGuards, ParseUUIDPipe, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ForecastingService } from './forecasting.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

@ApiTags('forecasting')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('forecasting')
export class ForecastingController {
  constructor(private readonly forecastingService: ForecastingService) {}

  @Get('cooperatives/:cooperativeId')
  @Roles('FEDERATION_ADMIN', 'SOCIETY_ADMIN')
  @ApiOperation({ summary: 'Get demand forecast for a specific cooperative' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  getForecast(
    @Param('cooperativeId', ParseUUIDPipe) cooperativeId: string,
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
  ) {
    return this.forecastingService.getForecastForCooperative(cooperativeId, days);
  }
}
