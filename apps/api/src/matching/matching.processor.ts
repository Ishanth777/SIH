import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MATCHING_QUEUE } from '../common/queue';
import { MatchingService } from './matching.service';
import { Logger } from '@nestjs/common';

@Processor(MATCHING_QUEUE)
export class MatchingProcessor extends WorkerHost {
  private readonly logger = new Logger(MatchingProcessor.name);

  constructor(private readonly matchingService: MatchingService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'match-workers': {
        const { serviceRequestId, cooperativeId } = job.data;
        this.logger.log(`Processing match for request ${serviceRequestId}`);
        await this.matchingService.matchWorkerToRequest(serviceRequestId, cooperativeId);
        break;
      }
      default:
        this.logger.warn(`Unknown job type in matching queue: ${job.name}`);
    }
  }
}
