import { Controller, Get, Post, Patch, Body, Param, UseGuards, ParseUUIDPipe, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto, ResolveDisputeDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

@ApiTags('disputes')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  @ApiOperation({ summary: 'Raise a new dispute (Worker/Customer)' })
  create(@Body() dto: CreateDisputeDto, @Req() req: any) {
    // Both customers and workers can raise disputes. req.user.sub is the userId.
    return this.disputesService.create(req.user.sub, dto);
  }

  @Get()
  @Roles('FEDERATION_ADMIN', 'SOCIETY_ADMIN')
  @ApiOperation({ summary: 'List all disputes (Admin)' })
  findAll() {
    return this.disputesService.findAll();
  }

  @Patch(':id/resolve')
  @Roles('FEDERATION_ADMIN', 'SOCIETY_ADMIN')
  @ApiOperation({ summary: 'Resolve a dispute (Admin)' })
  resolve(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ResolveDisputeDto) {
    return this.disputesService.resolve(id, dto);
  }
}
