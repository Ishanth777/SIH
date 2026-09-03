/**
 * DTO: Send OTP request.
 * Per rule C3: mirrored in packages/shared-types.
 * Per rule B2: class-validator decorators for whitelist validation.
 */
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({
    description: 'Indian mobile number with country code',
    example: '+919876543210',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+91[6-9]\d{9}$/, {
    message: 'Phone must be a valid Indian mobile number (e.g., +919876543210)',
  })
  phone!: string;
}
