import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, ValidateNested, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryForecastDto {
  @ApiProperty({ example: 'ELECTRICIAN', description: 'Service category' })
  @IsString()
  category!: string;

  @ApiProperty({ example: 25, description: 'Expected demand count' })
  @IsNumber()
  expectedDemand!: number;

  @ApiProperty({ example: 0.88, description: 'Confidence score (0.0 to 1.0)' })
  @IsNumber()
  confidenceScore!: number;
}

export class ForecastResponseDto {
  @ApiProperty({ example: '2026-09-04', description: 'Forecast date (YYYY-MM-DD)' })
  @IsString()
  date!: string;

  @ApiProperty({ type: [CategoryForecastDto], description: 'List of forecasts by category' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryForecastDto)
  forecasts!: CategoryForecastDto[];

  @ApiProperty({ example: false, required: false, description: 'Whether this forecast is a fallback estimate (Rule A3)' })
  @IsBoolean()
  @IsOptional()
  isFallback?: boolean;
}
