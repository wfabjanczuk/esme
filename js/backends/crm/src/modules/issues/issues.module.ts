import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './issue.entity';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { Event } from '../events/event.entity';
import { AgencyIssuesController } from './agency-issues.controller';
import { AgencyIssuesService } from './agency-issues.service';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, Event])],
  controllers: [IssuesController, AgencyIssuesController],
  providers: [IssuesService, AgencyIssuesService],
})
export class IssuesModule {}
