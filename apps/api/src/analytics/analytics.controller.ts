import { Controller, Get, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

@ApiTags('analytics')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('federation/:federationId')
  @Roles('FEDERATION_ADMIN')
  @ApiOperation({ summary: 'Get aggregated metrics for a Federation' })
  getFederationMetrics(@Param('federationId', ParseUUIDPipe) federationId: string) {
    return this.analyticsService.getFederationMetrics(federationId);
  }

  @Get('society/:cooperativeId')
  @Roles('FEDERATION_ADMIN', 'SOCIETY_ADMIN')
  @ApiOperation({ summary: 'Get aggregated metrics for a Cooperative Society' })
  getSocietyMetrics(@Param('cooperativeId', ParseUUIDPipe) cooperativeId: string) {
    return this.analyticsService.getSocietyMetrics(cooperativeId);
  }
}
