import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../modules/users/user-role.enum';

export class AgencyOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { agency, role } = context.switchToHttp().getRequest().currentUser;
    const isAdmin = [UserRole.superAdmin, UserRole.admin].includes(role);
    if (isAdmin) {
      return true;
    }

    if (!agency) {
      return false;
    }
    return [UserRole.agencyOwner].includes(role);
  }
}
