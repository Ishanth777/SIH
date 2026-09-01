import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CooperativesService } from './cooperatives.service';
import { CreateCooperativeDto, UpdateCooperativeDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

@ApiTags('cooperatives')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cooperatives')
export class CooperativesController {
  constructor(private readonly cooperativesService: CooperativesService) {}

  @Post()
  @Roles('FEDERATION_ADMIN')
  @ApiOperation({ summary: 'Create a new cooperative society' })
  @ApiResponse({ status: 201, description: 'Cooperative created' })
  create(@Body() dto: CreateCooperativeDto) {
    return this.cooperativesService.create(dto);
  }

  @Get()
  @Roles('FEDERATION_ADMIN', 'SOCIETY_ADMIN')
  @ApiOperation({ summary: 'List cooperatives by federation (paginated)' })
  @ApiQuery({ name: 'federationId', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('federationId', ParseUUIDPipe) federationId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.cooperativesService.findAll(federationId, page, limit);
  }

  @Get(':id')
  @Roles('FEDERATION_ADMIN', 'SOCIETY_ADMIN')
  @ApiOperation({ summary: 'Get cooperative by ID' })
  @ApiResponse({ status: 200, description: 'Cooperative details' })
  @ApiResponse({ status: 404, description: 'Cooperative not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cooperativesService.findOne(id);
  }

  @Patch(':id')
  @Roles('FEDERATION_ADMIN', 'SOCIETY_ADMIN')
  @ApiOperation({ summary: 'Update a cooperative' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCooperativeDto,
  ) {
    return this.cooperativesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('FEDERATION_ADMIN')
  @ApiOperation({ summary: 'Delete a cooperative' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cooperativesService.remove(id);
  }
}
