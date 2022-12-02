import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Changelog } from './changelog.entity';
import { LoggingEntityManager } from './logging-entity-manager';
import { ChangelogsService } from './changelogs.service';
import { ChangelogsController } from './changelogs.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Changelog])],
  controllers: [ChangelogsController],
  providers: [LoggingEntityManager, ChangelogsService],
  exports: [LoggingEntityManager],
})
export class ChangelogsModule {}
