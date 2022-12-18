import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../modules/users/user.entity';

export class AgencyManagerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    return [
      UserRole.agencyManager,
      UserRole.agencyOwner,
      UserRole.admin,
      UserRole.superAdmin,
    ].includes(request.currentUser.role);
  }
}
