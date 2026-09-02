import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ServicesCatalogService } from './services-catalog.service';
import { CreateServiceCatalogDto, UpdateServiceCatalogDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

@ApiTags('services-catalog')
@Controller('services-catalog')
export class ServicesCatalogController {
  constructor(private readonly servicesCatalogService: ServicesCatalogService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FEDERATION_ADMIN')
  @ApiOperation({ summary: 'Create service catalog entry' })
  @ApiResponse({ status: 201, description: 'Created' })
  create(@Body() dto: CreateServiceCatalogDto) {
    return this.servicesCatalogService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all service catalog entries (Public for booking)' })
  findAll() {
    return this.servicesCatalogService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service catalog entry by ID (Public)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesCatalogService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FEDERATION_ADMIN')
  @ApiOperation({ summary: 'Update service catalog entry' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateServiceCatalogDto) {
    return this.servicesCatalogService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FEDERATION_ADMIN')
  @ApiOperation({ summary: 'Delete service catalog entry' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesCatalogService.remove(id);
  }
}
