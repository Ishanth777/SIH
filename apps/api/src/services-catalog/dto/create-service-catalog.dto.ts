import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ServiceCategory {
  ELECTRICIAN = 'ELECTRICIAN',
  PLUMBER = 'PLUMBER',
  CLEANER = 'CLEANER',
  CAREGIVER = 'CAREGIVER',
}

export class CreateServiceCatalogDto {
  @ApiProperty({ enum: ServiceCategory })
  @IsEnum(ServiceCategory)
  category!: ServiceCategory;

  @ApiProperty({ example: 'Electrician Services' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Minimum fair-wage rate' })
  @IsNumber()
  @Min(0)
  baseRateMin!: number;

  @ApiProperty({ description: 'Maximum fair-wage rate' })
  @IsNumber()
  @Min(0)
  baseRateMax!: number;

  @ApiPropertyOptional({ default: 'per_hour' })
  @IsOptional()
  @IsString()
  unit?: string;
}
