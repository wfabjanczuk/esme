import { Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleAsyncOptions } from '../typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { EventsModule } from './modules/events/events.module';
import { AgenciesModule } from './modules/agencies/agencies.module';
import { ChangelogsModule } from './modules/changelogs/changelogs.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { IssuesModule } from './modules/issues/issues.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleAsyncOptions),
    UsersModule,
    ChangelogsModule,
    AgenciesModule,
    EventsModule,
    ContactsModule,
    AnnouncementsModule,
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
