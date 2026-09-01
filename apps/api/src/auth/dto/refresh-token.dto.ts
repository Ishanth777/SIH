/**
 * DTO: Refresh token request.
 */
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}
