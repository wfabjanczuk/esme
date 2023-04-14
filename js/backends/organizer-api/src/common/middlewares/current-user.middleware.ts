import { AdminUsersService } from '../../modules/admin-users/admin-users.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../modules/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import {
  Issuer,
  JwtPayload,
  OrganizerTokenPrefix,
} from '../../modules/authentication/jwt.config';

declare global {
  export namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private usersService: AdminUsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    req.currentUser = await this.getCurrentUser(req);
    next();
  }

  async getCurrentUser(req: Request): Promise<User | undefined> {
    const payload = this.getPayload(req.header('Authorization'));
    if (!payload) {
      return undefined;
    }

    return this.findUser(payload);
  }

  getPayload(authorizationHeader: string): JwtPayload | undefined {
    if (!authorizationHeader) {
      return undefined;
    }

    const headerParts = authorizationHeader.split(' ');
    if (headerParts.length !== 2 || headerParts[0] !== 'Bearer') {
      return undefined;
    }

    const tokenParts = headerParts[1].split(':');
    if (tokenParts.length !== 2 || tokenParts[0] !== OrganizerTokenPrefix) {
      return undefined;
    }

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(tokenParts[1]);
    } catch (e) {
      return undefined;
    }

    const now = Date.now() / 1000;
    if (now < payload.nbf || payload.exp < now) {
      return undefined;
    }
    if (payload.iss !== Issuer || payload.aud[0] !== Issuer) {
      return undefined;
    }

    return payload;
  }

  async findUser(payload: JwtPayload): Promise<User | undefined> {
    let user: User;
    try {
      user = await this.usersService.findOne(payload.sub);
    } catch (e) {
      return undefined;
    }
    const timeSignOut = user.timeSignOut.getTime() / 1000;
    if (payload.iat < timeSignOut) {
      return undefined;
    }

    delete user.password;
    return user;
  }
}
