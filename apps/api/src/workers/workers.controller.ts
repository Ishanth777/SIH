import {
  Controller, Get, Post, Patch, Body, Param, Query,
  UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WorkersService } from './workers.service';
import { RegisterWorkerDto, UpdateWorkerDto, VerifyWorkerDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

@ApiTags('workers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post('register')
  @Roles('SOCIETY_ADMIN', 'FEDERATION_ADMIN')
  @ApiOperation({ summary: 'Register a new worker' })
  @ApiResponse({ status: 201, description: 'Worker registered' })
  register(@Body() dto: RegisterWorkerDto) {
    return this.workersService.register(dto);
  }

  @Get()
  @Roles('SOCIETY_ADMIN', 'FEDERATION_ADMIN')
  @ApiOperation({ summary: 'List workers by cooperative (paginated)' })
  @ApiQuery({ name: 'cooperativeId', required: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('cooperativeId', ParseUUIDPipe) cooperativeId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.workersService.findAll(cooperativeId, page, limit);
  }

  @Get(':id')
  @Roles('SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'WORKER')
  @ApiOperation({ summary: 'Get worker by ID' })
  @ApiResponse({ status: 200, description: 'Worker details' })
  @ApiResponse({ status: 404, description: 'Worker not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.workersService.findOne(id);
  }

  @Patch(':id')
  @Roles('WORKER', 'SOCIETY_ADMIN')
  @ApiOperation({ summary: 'Update worker profile' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWorkerDto,
  ) {
    return this.workersService.update(id, dto);
  }

  @Patch(':id/verify')
  @Roles('SOCIETY_ADMIN', 'FEDERATION_ADMIN')
  @ApiOperation({ summary: 'Update worker verification status (KYC)' })
  @ApiResponse({ status: 200, description: 'Verification status updated' })
  verify(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VerifyWorkerDto,
  ) {
    return this.workersService.verify(id, dto);
  }

  @Patch(':id/availability')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Toggle worker availability' })
  toggleAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.workersService.toggleAvailability(id, isAvailable);
  }

  @Patch(':id/location')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Update worker location for geo-matching' })
  updateLocation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
  ) {
    return this.workersService.updateLocation(id, latitude, longitude);
  }
}
