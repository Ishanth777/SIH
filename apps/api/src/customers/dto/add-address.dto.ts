import {
  IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional,
  Min, Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddAddressDto {
  @ApiProperty({ description: 'Address label', example: 'Home' })
  @IsNotEmpty()
  @IsString()
  label!: string;

  @ApiProperty({ description: 'Full address string' })
  @IsNotEmpty()
  @IsString()
  address!: string;

  @ApiProperty({ description: 'Latitude', example: 9.9312 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({ description: 'Longitude', example: 76.2673 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @ApiPropertyOptional({ description: 'Set as default address', default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
