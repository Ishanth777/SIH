import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ForecastingController } from './forecasting.controller';
import { ForecastingService } from './forecasting.service';

@Module({
  imports: [HttpModule],
  controllers: [ForecastingController],
  providers: [ForecastingService],
  exports: [ForecastingService],
})
export class ForecastingModule {}
