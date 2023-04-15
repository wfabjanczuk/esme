import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../modules/users/user-role.enum';

export class AuthenticationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) {
      return false;
    }

    const isAdmin = [UserRole.admin, UserRole.superAdmin].includes(
      request.currentUser.role,
    );
    return isAdmin || request.currentUser?.agency?.approved;
  }
}
