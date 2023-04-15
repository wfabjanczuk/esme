import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Changelog } from '../changelogs/changelog.entity';
import { AdminChangelogsService } from './admin-changelogs.service';
import { AdminChangelogsController } from './admin-changelogs.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Changelog])],
  controllers: [AdminChangelogsController],
  providers: [AdminChangelogsService],
})
export class AdminChangelogsModule {}
