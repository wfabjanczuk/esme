import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Changelog } from './changelog.entity';
import { LoggingEntityManager } from './logging-entity-manager';
import { ChangelogsService } from './changelogs.service';
import { ChangelogsController } from './changelogs.controller';
import { AgencyChangelogsController } from './agency-changelogs.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Changelog])],
  controllers: [ChangelogsController, AgencyChangelogsController],
  providers: [LoggingEntityManager, ChangelogsService],
  exports: [LoggingEntityManager],
})
export class ChangelogsModule {}
