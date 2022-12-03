import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleAsyncOptions } from '../typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { EventsModule } from './modules/events/events.module';
import { AgenciesModule } from './modules/agencies/agencies.module';
import { ChangelogsModule } from './modules/changelogs/changelogs.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { ContactsModule } from './modules/contacts/contacts.module';

const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleAsyncOptions),
    ChangelogsModule,
    UsersModule,
    AgenciesModule,
    EventsModule,
    ContactsModule,
    AnnouncementsModule,
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
export class AppModule {
  constructor(private config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.config.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
