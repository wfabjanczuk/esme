import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../modules/users/user.entity';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { role } = context.switchToHttp().getRequest().currentUser;
    return role <= UserRole.admin;
  }
}
