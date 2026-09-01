import { Controller, Get, Patch, Body, Param, UseGuards, ParseUUIDPipe, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { UpdateJobStatusDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

@ApiTags('jobs')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Patch(':id/status')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Worker updates job status (Accept/Reject/Start/Complete)' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJobStatusDto,
    @Req() req: any,
  ) {
    // We assume JWT strategy attaches workerId to the user payload if they are a worker
    return this.jobsService.updateJobStatus(id, req.user.workerId, dto.action);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job details' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobsService.findOne(id);
  }
}
