import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Changelog } from './changelog.entity';
import { LoggingEntityManager } from './logging-entity-manager';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Changelog])],
  providers: [LoggingEntityManager],
  exports: [LoggingEntityManager],
})
export class ChangelogsModule {}
