/**
 * JWT Strategy for Passport.
 * Extracts JWT from Bearer header and validates against access secret.
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../common/prisma';
import type { JwtPayload } from '../auth.service';
import type { EnvConfig } from '../../common/config/env.validation';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService<EnvConfig, true>,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_ACCESS_SECRET', { infer: true }),
    });
  }

  /**
   * Validate JWT payload and bind RLS tenant context.
   * Per rule A1: sets app.current_cooperative_id on the Postgres session.
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or deactivated');
    }

    // Set RLS tenant context (rule A1)
    if (user.cooperativeId) {
      await this.prisma.setTenantContext(user.cooperativeId);
    }
    if (user.federationId) {
      await this.prisma.setFederationContext(user.federationId);
    }

    return payload;
  }
}
