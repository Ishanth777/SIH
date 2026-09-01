import { Controller, Get, Post, Body, Param, UseGuards, ParseUUIDPipe, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WelfareService } from './welfare.service';
import { CreateWelfareSchemeDto, EnrollWelfareDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

@ApiTags('welfare')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('welfare')
export class WelfareController {
  constructor(private readonly welfareService: WelfareService) {}

  @Post('schemes')
  @Roles('FEDERATION_ADMIN')
  @ApiOperation({ summary: 'Create a new welfare scheme' })
  createScheme(@Body() dto: CreateWelfareSchemeDto) {
    return this.welfareService.createScheme(dto);
  }

  @Get('schemes')
  @ApiOperation({ summary: 'List all active welfare schemes' })
  findAllSchemes() {
    return this.welfareService.findAllSchemes();
  }

  @Post('enroll')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Worker enrolls in a welfare scheme' })
  enroll(@Body() dto: EnrollWelfareDto, @Req() req: any) {
    return this.welfareService.enrollWorker(req.user.workerId, dto);
  }

  @Get('my-enrollments')
  @Roles('WORKER')
  @ApiOperation({ summary: 'List worker enrollments' })
  findMyEnrollments(@Req() req: any) {
    return this.welfareService.findWorkerEnrollments(req.user.workerId);
  }
}
