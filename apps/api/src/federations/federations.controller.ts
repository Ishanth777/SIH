/**
 * Federations Controller — thin layer for Federation CRUD.
 * Per rule C2: delegates to FederationsService.
 * Per rule C4: Swagger-decorated.
 */
import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FederationsService } from './federations.service';
import { CreateFederationDto, UpdateFederationDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

@ApiTags('federations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('federations')
export class FederationsController {
  constructor(private readonly federationsService: FederationsService) {}

  @Post()
  @Roles('FEDERATION_ADMIN')
  @ApiOperation({ summary: 'Create a new federation' })
  @ApiResponse({ status: 201, description: 'Federation created' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  create(@Body() dto: CreateFederationDto) {
    return this.federationsService.create(dto);
  }

  @Get()
  @Roles('FEDERATION_ADMIN')
  @ApiOperation({ summary: 'List all federations (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of federations' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.federationsService.findAll(page, limit);
  }

  @Get(':id')
  @Roles('FEDERATION_ADMIN', 'SOCIETY_ADMIN')
  @ApiOperation({ summary: 'Get federation by ID' })
  @ApiResponse({ status: 200, description: 'Federation details' })
  @ApiResponse({ status: 404, description: 'Federation not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.federationsService.findOne(id);
  }

  @Patch(':id')
  @Roles('FEDERATION_ADMIN')
  @ApiOperation({ summary: 'Update a federation' })
  @ApiResponse({ status: 200, description: 'Federation updated' })
  @ApiResponse({ status: 404, description: 'Federation not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFederationDto,
  ) {
    return this.federationsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('FEDERATION_ADMIN')
  @ApiOperation({ summary: 'Delete a federation' })
  @ApiResponse({ status: 200, description: 'Federation deleted' })
  @ApiResponse({ status: 404, description: 'Federation not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.federationsService.remove(id);
  }
}
