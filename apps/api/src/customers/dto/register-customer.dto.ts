import { IsNotEmpty, IsString, IsUUID, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterCustomerDto {
  @ApiProperty({ description: 'User ID of the customer' })
  @IsNotEmpty()
  @IsUUID()
  userId!: string;

  @ApiProperty({ description: 'Cooperative the customer belongs to' })
  @IsNotEmpty()
  @IsUUID()
  cooperativeId!: string;

  @ApiProperty({ description: 'Customer full name', example: 'Priya Sharma' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'priya@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
