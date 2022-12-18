import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../modules/users/user.entity';

export class AgencySupportGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    return [
      UserRole.agencySupport,
      UserRole.agencyManager,
      UserRole.agencyOwner,
      UserRole.admin,
      UserRole.superAdmin,
    ].includes(request.currentUser.role);
  }
}
