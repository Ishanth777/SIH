import { Module } from '@nestjs/common';
import { WorkersController } from './workers.controller';
import { WorkersService } from './workers.service';
import { FileUploadService } from '../common/services/file-upload.service';

@Module({
  controllers: [WorkersController],
  providers: [WorkersService, FileUploadService],
  exports: [WorkersService],
})
export class WorkersModule {}
