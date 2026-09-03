import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFederationDto {
  @ApiProperty({ description: 'Federation name', example: 'Kerala Labour Federation' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Description of the federation' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'URL to federation logo' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}
