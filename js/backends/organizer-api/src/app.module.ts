import { Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleAsyncOptions } from '../typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { EventsModule } from './modules/events/events.module';
import { AgencyModule } from './modules/agency/agency.module';
import { ChangelogsModule } from './modules/changelogs/changelogs.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { IssuesModule } from './modules/issues/issues.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AdminAgenciesModule } from './modules/admin-agencies/admin-agencies.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { ProfileModule } from './modules/profile/profile.module';
import { AdminUsersModule } from './modules/admin-users/admin-users.module';
import { AdminChangelogsModule } from './modules/admin-changelogs/admin-changelogs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleAsyncOptions),
    AuthenticationModule,
    AdminAgenciesModule,
    AdminUsersModule,
    AdminChangelogsModule,
    ProfileModule,
    UsersModule,
    ChangelogsModule,
    AgencyModule,
    EventsModule,
    ContactsModule,
    IssuesModule,
    CommentsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class AppModule {}
