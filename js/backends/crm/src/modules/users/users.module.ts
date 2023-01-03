import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserMiddleware } from '../../common/middlewares/current-user.middleware';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { AgencyUsersController } from './agency-users.controller';
import { AgencyUsersService } from './agency-users.service';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [
    AuthenticationController,
    ProfileController,
    UsersController,
    AgencyUsersController,
  ],
  providers: [
    AuthenticationService,
    ProfileService,
    UsersService,
    AgencyUsersService,
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
