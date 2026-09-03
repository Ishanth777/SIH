import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingProcessor } from './matching.processor';

@Module({
  providers: [MatchingService, MatchingProcessor],
  exports: [MatchingService],
})
export class MatchingModule {}
