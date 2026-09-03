/**
 * DTO: Verify OTP request.
 * Per rule C3: mirrored in packages/shared-types.
 */
import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Indian mobile number with country code',
    example: '+919876543210',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+91[6-9]\d{9}$/, {
    message: 'Phone must be a valid Indian mobile number',
  })
  phone!: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'OTP must contain only digits' })
  code!: string;
}
