import { UsersService } from '../users.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from '../user.entity';

declare global {
  export namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { userId } = req.session || {};

    if (userId) {
      try {
        req.currentUser = await this.usersService.findOne(userId);
      } catch (e) {
        req.currentUser = undefined;
        req.session.userId = undefined;
      }
    }

    next();
  }
}
