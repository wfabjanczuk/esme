import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthenticationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.session.userId) {
      return false;
    }
    const agency = request.currentUser.agency;
    if (agency) {
      return agency.approved;
    }
    return true;
  }
}
