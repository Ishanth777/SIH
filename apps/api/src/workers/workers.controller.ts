import {
  Controller, Get, Post, Patch, Body, Param, Query,
  UseGuards, ParseUUIDPipe, UseInterceptors, UploadedFile, BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { WorkersService } from './workers.service';
import { FileUploadService } from '../common/services/file-upload.service';
import { RegisterWorkerDto, UpdateWorkerDto, VerifyWorkerDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

@ApiTags('workers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('workers')
export class WorkersController {
  constructor(
    private readonly workersService: WorkersService,
    private readonly fileUploadService: FileUploadService
  ) {}

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

  @Post(':id/kyc-upload')
  @Roles('WORKER', 'SOCIETY_ADMIN', 'FEDERATION_ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload KYC document for worker' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadKycDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const fileUrl = await this.fileUploadService.uploadFile(file, 'kyc');
    
    // We should probably update the worker's kycDocumentUrls here if needed,
    // or just return the URL so the frontend can submit it via the verify endpoint.
    return { url: fileUrl };
  }
}



