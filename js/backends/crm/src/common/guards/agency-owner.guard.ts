import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../modules/users/user.entity';

export class AgencyOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { agency, role } = context.switchToHttp().getRequest().currentUser;
    if (!agency) {
      return false;
    }
    return role <= UserRole.agencyOwner;
  }
}
