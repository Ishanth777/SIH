import { IsNotEmpty, IsString, IsOptional, IsUUID, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCooperativeDto {
  @ApiProperty({ description: 'Parent federation ID' })
  @IsNotEmpty()
  @IsUUID()
  federationId!: string;

  @ApiProperty({ description: 'Cooperative name', example: 'Kochi Workers Cooperative' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Description of the cooperative' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Office address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Unique registration number' })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'Headquarters latitude', example: 9.9312 })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({ description: 'Headquarters longitude', example: 76.2673 })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}
