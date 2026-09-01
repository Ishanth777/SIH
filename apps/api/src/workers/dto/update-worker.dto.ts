import {
  IsOptional, IsString, IsArray, IsEnum, IsNumber,
  IsBoolean, Min, Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

enum ServiceCategory {
  ELECTRICIAN = 'ELECTRICIAN',
  PLUMBER = 'PLUMBER',
  CLEANER = 'CLEANER',
  CAREGIVER = 'CAREGIVER',
}

export class UpdateWorkerDto {
  @ApiPropertyOptional({ description: 'Worker name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Service skills', enum: ServiceCategory, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(ServiceCategory, { each: true })
  skills?: ServiceCategory[];

  @ApiPropertyOptional({ description: 'Availability toggle' })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ description: 'Latitude' })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude' })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}
