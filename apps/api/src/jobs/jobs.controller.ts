import { Controller, Get, Patch, Post, Body, Param, UseGuards, ParseUUIDPipe, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { JobsService } from './jobs.service';
import { UpdateJobStatusDto, RateJobDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

interface AuthenticatedWorkerRequest extends Request {
  user: {
    sub: string;
    phone: string;
    role: string;
    workerId?: string;
  };
}

@ApiTags('jobs')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Patch(':id/status')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Worker updates job status (Accept/Reject/Start/Complete)' })
  @ApiResponse({ status: 200, description: 'Job status updated' })
  @ApiResponse({ status: 400, description: 'Invalid state transition' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJobStatusDto,
    @Req() req: AuthenticatedWorkerRequest,
  ) {
    const workerId = req.user.workerId || req.user.sub;
    return this.jobsService.updateJobStatus(id, workerId, dto.action);
  }

  @Post(':id/rate')
  @ApiOperation({ summary: 'Customer rates a completed job' })
  @ApiResponse({ status: 201, description: 'Rating submitted successfully' })
  @ApiResponse({ status: 400, description: 'Job not completed or already rated' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  rate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RateJobDto,
    @Req() req: any,
  ) {
    const customerId = req.user?.sub || null;
    return this.jobsService.rateJob(id, customerId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job details' })
  @ApiResponse({ status: 200, description: 'Job details retrieved' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobsService.findOne(id);
  }
}

