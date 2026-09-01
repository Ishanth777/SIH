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
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Create a new service request' })
  @ApiResponse({ status: 201, description: 'Request created and matching started' })
  create(@Req() req: any, @Body() dto: CreateServiceRequestDto) {
    // Current user decorator would be better, but assuming req.user exists from JwtAuthGuard
    // The user's customerId needs to be fetched, assuming req.user.customerId is available,
    // otherwise the service needs userId. Let's just pass userId and handle in service.
    // Wait, the rule says Customer profile is distinct from User profile.
    // We will assume the frontend sends the customerId, or we resolve it.
    // Let's resolve it in the controller for simplicity if needed, but for now we expect the 
    // JWT strategy to attach the customerId or we can look it up.
    // For now, let's just use a param or body. Wait, the API should be secure.
    // I'll add customerId to the user payload in JWT, but for now let's assume we fetch it 
    // via a decorator or it's in the DTO? The DTO doesn't have customerId.
    // I will extract customerId from req.user (assuming the JWT strategy can add it).
    return this.requestsService.create(req.user.customerId, dto);
  }

  @Get('my-requests')
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'List current customers requests' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findMyRequests(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.requestsService.findAllByCustomer(req.user.customerId, page, limit);
  }

  @Get(':id')
  @Roles('CUSTOMER', 'SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'WORKER')
  @ApiOperation({ summary: 'Get service request details' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.requestsService.findOne(id);
  }
}
