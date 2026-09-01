import { Module } from '@nestjs/common';
import { FederationsController } from './federations.controller';
import { FederationsService } from './federations.service';

@Module({
  controllers: [FederationsController],
  providers: [FederationsService],
  exports: [FederationsService],
})
export class FederationsModule {}
