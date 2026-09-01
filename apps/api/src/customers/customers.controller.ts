import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { RegisterCustomerDto, UpdateCustomerDto, AddAddressDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

@ApiTags('customers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('register')
  @Roles('SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'CUSTOMER')
  @ApiOperation({ summary: 'Register a new customer' })
  @ApiResponse({ status: 201, description: 'Customer registered' })
  register(@Body() dto: RegisterCustomerDto) {
    return this.customersService.register(dto);
  }

  @Get()
  @Roles('SOCIETY_ADMIN', 'FEDERATION_ADMIN')
  @ApiOperation({ summary: 'List customers by cooperative (paginated)' })
  @ApiQuery({ name: 'cooperativeId', required: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('cooperativeId', ParseUUIDPipe) cooperativeId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.customersService.findAll(cooperativeId, page, limit);
  }

  @Get(':id')
  @Roles('SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'CUSTOMER')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer details with addresses' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @Roles('CUSTOMER', 'SOCIETY_ADMIN')
  @ApiOperation({ summary: 'Update customer profile' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, dto);
  }

  @Post(':id/addresses')
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Add a new address to address book' })
  @ApiResponse({ status: 201, description: 'Address added' })
  addAddress(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddAddressDto,
  ) {
    return this.customersService.addAddress(id, dto);
  }

  @Delete(':id/addresses/:addressId')
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Remove an address' })
  removeAddress(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('addressId', ParseUUIDPipe) addressId: string,
  ) {
    return this.customersService.removeAddress(id, addressId);
  }
}
