import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './issue.entity';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { Event } from '../events/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, Event])],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService],
})
export class IssuesModule {}
