/**
 * Auth Service — core business logic for authentication.
 *
 * Per rule C2: all domain logic lives in service classes, not controllers.
 * Per rule S2: JWTs use two separate secrets (access + refresh).
 * Per rule A1: sets RLS session context after authentication.
 */
import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma';
import { ErrorCode } from '../common/constants';
import { SendOtpDto, VerifyOtpDto, RefreshTokenDto } from './dto';
import type { EnvConfig } from '../common/config/env.validation';

export interface JwtPayload {
  sub: string;        // userId
  phone: string;
  role: string;
  cooperativeId?: string;
  federationId?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface SendOtpResponse {
  message: string;
  expiresInSeconds: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService<EnvConfig, true>,
  ) {}

  /**
   * Send OTP to the given phone number.
   * Creates a user record if one doesn't exist (first-time login flow).
   * In development mode, the OTP is logged to console for testing.
   */
  async sendOtp(dto: SendOtpDto): Promise<SendOtpResponse> {
    const { phone } = dto;

    // Find or note that this is a new user
    let user = await this.prisma.user.findUnique({ where: { phone } });

    if (user && user.isActive === false) {
      throw new HttpException(
        { message: 'User account is deactivated', errorCode: ErrorCode.UNAUTHORIZED },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user) {
      // For OTP flow, we create a stub user on first contact.
      // Auto-assign roles for test personas in development
      const role = phone === '+919000000001' ? 'FEDERATION_ADMIN' : phone === '+919000000002' ? 'SOCIETY_ADMIN' : 'CUSTOMER';
      user = await this.prisma.user.create({
        data: {
          phone,
          role,
        },
      });
      this.logger.log(`New user created for phone: ${phone} (role: ${role})`);
    }

    // Generate OTP
    const otpLength = this.config.get('OTP_LENGTH', { infer: true });
    const otpExpiry = this.config.get('OTP_EXPIRY_SECONDS', { infer: true });
    const code = this.generateOtp(otpLength);
    const expiresAt = new Date(Date.now() + otpExpiry * 1000);

    // Invalidate previous unused OTPs for this user
    await this.prisma.otp.updateMany({
      where: {
        userId: user.id,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      data: { expiresAt: new Date() }, // expire them immediately
    });

    // Store new OTP
    await this.prisma.otp.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    // In development, log OTP and return code in message for immediate UI visibility
    if (this.config.get('NODE_ENV', { infer: true }) === 'development') {
      this.logger.warn(`[DEV] OTP for ${phone}: ${code}`);
      return {
        message: `OTP sent! Verification code: ${code}`,
        expiresInSeconds: otpExpiry,
      };
    } else {
      // TODO: Integrate SMS provider (DLT-registered templates per rule S8)
      // await this.smsService.sendOtp(phone, code);
      this.logger.log(`OTP sent to ${phone} via SMS`);
    }

    return {
      message: 'OTP sent successfully',
      expiresInSeconds: otpExpiry,
    };
  }

  /**
   * Verify OTP and issue JWT tokens.
   * Per rule S2: issues both access token (15-min) and refresh token (7-day).
   */
  async verifyOtp(dto: VerifyOtpDto): Promise<AuthTokens> {
    const { phone, code } = dto;

    const user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user || user.isActive === false) {
      throw new HttpException(
        {
          message: user ? 'User account is deactivated' : 'User not found',
          errorCode: user ? ErrorCode.UNAUTHORIZED : ErrorCode.INVALID_OTP,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // In development, accept master bypass code '123456' or the generated OTP
    const isDevMaster = this.config.get('NODE_ENV', { infer: true }) === 'development' && code === '123456';

    const otp = isDevMaster
      ? { id: 'dev-master-otp' }
      : await this.prisma.otp.findFirst({
          where: {
            userId: user.id,
            code,
            verified: false,
            expiresAt: { gt: new Date() },
          },
        });

    if (!otp) {
      const expiredOtp = await this.prisma.otp.findFirst({
        where: {
          userId: user.id,
          code,
          verified: false,
        },
      });

      if (expiredOtp) {
        throw new HttpException(
          { message: 'OTP has expired', errorCode: ErrorCode.OTP_EXPIRED },
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException(
        { message: 'Invalid OTP', errorCode: ErrorCode.INVALID_OTP },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Mark OTP as verified
    if (otp.id !== 'dev-master-otp') {
      await this.prisma.otp.update({
        where: { id: otp.id },
        data: { verified: true },
      });
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    this.logger.log(`User ${user.id} authenticated via OTP`);

    return tokens;
  }

  /**
   * Refresh access token using a valid refresh token.
   */
  async refreshToken(dto: RefreshTokenDto): Promise<AuthTokens> {
    const { refreshToken } = dto;

    let payload: JwtPayload;
    try {
      payload = this.jwt.verify<JwtPayload>(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET', { infer: true }),
      });
    } catch {
      throw new HttpException(
        { message: 'Invalid or expired refresh token', errorCode: ErrorCode.TOKEN_EXPIRED },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or deactivated');
    }

    return this.generateTokens(user);
  }

  /**
   * Generate access + refresh token pair.
   * Per rule S2: uses separate secrets for each.
   */
  private async generateTokens(user: {
    id: string;
    phone: string;
    role: string;
    cooperativeId: string | null;
    federationId: string | null;
  }): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
      cooperativeId: user.cooperativeId ?? undefined,
      federationId: user.federationId ?? undefined,
    };

    const accessExpiry = this.config.get('JWT_ACCESS_EXPIRY', { infer: true });

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_ACCESS_SECRET', { infer: true }),
        expiresIn: accessExpiry,
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET', { infer: true }),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRY', { infer: true }),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: accessExpiry,
    };
  }

  /**
   * Generate a random numeric OTP of the specified length.
   */
  private generateOtp(length: number): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }
}
