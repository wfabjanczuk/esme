import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

const typeOrmModuleFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return {
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: ['**/*.entity.js'],
        synchronize: true,
      };
    case 'dev':
      return {
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: ['**/*.entity.js'],
        synchronize: true,
      };
    case 'test':
      return {
        type: 'sqlite',
        database: 'esme.test.sqlite',
        entities: ['**/*.entity.ts'],
        synchronize: true,
      };
    default:
      throw new Error('Environment unknown for TypeOrm');
  }
};

export const typeOrmModuleAsyncOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: typeOrmModuleFactory,
};
