/**
 * @Roles() decorator — attaches required roles metadata to route handlers.
 *
 * Usage:
 *   @Roles(Role.FEDERATION_ADMIN, Role.SOCIETY_ADMIN)
 *   @UseGuards(JwtAuthGuard, RolesGuard)
 *   findAll() { ... }
 */
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
