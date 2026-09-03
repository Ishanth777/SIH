import {
  Controller, Get, Post, Body, Param, Query,
  UseGuards, ParseUUIDPipe, Req
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateServiceRequestDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

@ApiTags('requests')
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service request' })
  @ApiResponse({ status: 201, description: 'Request created and matching started' })
  create(@Req() req: any, @Body() dto: CreateServiceRequestDto) {
    const customerId = req?.user?.customerId || 'c5555555-5555-5555-5555-555555555555';
    return this.requestsService.create(customerId, dto);
  }

  @Get('my-requests')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'List current customers requests' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findMyRequests(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const customerId = req?.user?.customerId || 'c5555555-5555-5555-5555-555555555555';
    return this.requestsService.findAllByCustomer(customerId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service request details' })
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }
}
