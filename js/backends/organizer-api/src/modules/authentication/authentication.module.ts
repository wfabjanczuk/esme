import { MiddlewareConsumer, Module } from '@nestjs/common';
import { User } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserMiddleware } from '../../common/middlewares/current-user.middleware';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { jwtModuleAsyncOptions } from './jwt.config';
import { AdminUsersModule } from '../admin-users/admin-users.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync(jwtModuleAsyncOptions),
    TypeOrmModule.forFeature([User]),
    AdminUsersModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
