import {
  IsEnum, IsNotEmpty, IsNumber, IsOptional,
  IsString, IsUUID, Min, Max, IsDateString
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum RequestType {
  SCHEDULED = 'SCHEDULED',
  EMERGENCY = 'EMERGENCY',
}

export class CreateServiceRequestDto {
  @ApiProperty({ description: 'ID of the service catalog entry' })
  @IsNotEmpty()
  @IsUUID()
  serviceCatalogId!: string;

  @ApiProperty({ description: 'Cooperative society the request is placed in' })
  @IsNotEmpty()
  @IsUUID()
  cooperativeId!: string;

  @ApiProperty({ enum: RequestType })
  @IsEnum(RequestType)
  type!: RequestType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Full address string' })
  @IsNotEmpty()
  @IsString()
  address!: string;

  @ApiProperty({ description: 'Latitude for geo-matching' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({ description: 'Longitude for geo-matching' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @ApiPropertyOptional({ description: 'Required for SCHEDULED requests' })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional({ description: 'Estimated hours of work' })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  estimatedHours?: number;
}
