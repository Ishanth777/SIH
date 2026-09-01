/**
 * RBAC Guard — checks user role against @Roles() decorator.
 *
 * Per rule T3: cross-tenant access failures return 403 Forbidden,
 * not 200 with empty results.
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ErrorCode } from '../../common/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No roles specified → allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as { role: string } | undefined;

    if (!user) {
      throw new ForbiddenException({
        message: 'Access denied',
        errorCode: ErrorCode.FORBIDDEN,
      });
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException({
        message: 'Insufficient permissions',
        errorCode: ErrorCode.FORBIDDEN,
      });
    }

    return true;
  }
}
