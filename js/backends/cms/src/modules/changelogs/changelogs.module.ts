import { Global, Module } from '@nestjs/common';
import { ChangelogsService } from './changelogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Changelog } from './changelog.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Changelog])],
  providers: [ChangelogsService],
  exports: [ChangelogsService],
})
export class ChangelogsModule {}
