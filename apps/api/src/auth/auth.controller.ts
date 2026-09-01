/**
 * Auth Controller — thin layer that delegates to AuthService.
 *
 * Per rule C2: no business logic here.
 * Per rule C4: Swagger decorators added alongside endpoints.
 */
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, RefreshTokenDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 5 } }) // Tighter rate limit for OTP (rule B4)
  @ApiOperation({
    summary: 'Send OTP to phone number',
    description: 'Sends a 6-digit OTP to the provided Indian mobile number. Creates a user stub if first-time.',
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid phone number format' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({
    summary: 'Verify OTP and get tokens',
    description: 'Verifies the OTP and returns JWT access + refresh tokens.',
  })
  @ApiResponse({ status: 200, description: 'Authentication successful — tokens returned' })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Issues a new access + refresh token pair using a valid refresh token.',
  })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }
}
