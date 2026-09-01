import {
  IsNotEmpty, IsString, IsUUID, IsOptional, IsArray,
  IsEnum, IsNumber, Min, Max, ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Matches Prisma ServiceCategory enum
enum ServiceCategory {
  ELECTRICIAN = 'ELECTRICIAN',
  PLUMBER = 'PLUMBER',
  CLEANER = 'CLEANER',
  CAREGIVER = 'CAREGIVER',
}

export class RegisterWorkerDto {
  @ApiProperty({ description: 'User ID of the worker' })
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @ApiProperty({ description: 'Cooperative the worker belongs to' })
  @IsNotEmpty()
  @IsUUID()
  cooperativeId!: string;

  @ApiProperty({ description: 'Worker full name', example: 'Raju Kumar' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Service skills (at least one)',
    enum: ServiceCategory,
    isArray: true,
    example: ['ELECTRICIAN', 'PLUMBER'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(ServiceCategory, { each: true })
  skills!: ServiceCategory[];

  @ApiPropertyOptional({ description: 'Worker latitude for geo-matching' })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({ description: 'Worker longitude for geo-matching' })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}
