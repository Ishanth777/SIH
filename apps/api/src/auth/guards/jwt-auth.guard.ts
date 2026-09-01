/**
 * JWT Authentication Guard.
 * Applied to protected routes to enforce Bearer token authentication.
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
