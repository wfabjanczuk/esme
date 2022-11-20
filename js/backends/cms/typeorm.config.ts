import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

let dynamicOrmConfig: DataSourceOptions;

switch (process.env.NODE_ENV) {
  case 'production':
    dynamicOrmConfig = {
      type: 'postgres',
      database: 'esme',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: ['**/*.entity.js'],
      synchronize: false,
      migrations: [__dirname + '/src/migrations/prod/*.js'],
      migrationsRun: true,
    };
    break;
  case 'dev':
    dynamicOrmConfig = {
      type: 'sqlite',
      database: 'esme.dev.sqlite',
      entities: ['**/*.entity.js'],
      synchronize: true,
    };
    break;
  case 'test':
    dynamicOrmConfig = {
      type: 'sqlite',
      database: 'esme.test.sqlite',
      entities: ['**/*.entity.ts'],
      synchronize: true,
    };
    break;
  default:
    throw new Error('Environment unknown for TypeOrm');
}

const ormConfig: DataSourceOptions = dynamicOrmConfig;

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async () => ormConfig,
};

export default new DataSource(ormConfig);
