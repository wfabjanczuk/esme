import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from './issue.entity';
import { User } from '../users/user.entity';
import { CreateIssueDto } from './dtos/create-issue.dto';
import { UpdateIssueDto } from './dtos/update-issue.dto';
import { Event } from '../events/event.entity';
import { FindIssuesOptionsDto } from './dtos/find-issues-options.dto';

@Injectable()
export class IssuesService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(Issue) private issuesRepo: Repository<Issue>,
    @InjectRepository(Event) private eventsRepo: Repository<Event>,
  ) {}

  async findOne(id: number) {
    const issue = await this.issuesRepo.findOneBy({ id });
    if (!issue) {
      throw new NotFoundException(`Issue with id ${id} not found`);
    }
    return issue;
  }

  findAll(options: FindIssuesOptionsDto) {
    return this.issuesRepo.find({ where: options });
  }

  async create(props: CreateIssueDto, createdBy: User) {
    const event = await this.eventsRepo.findOneBy({ id: props.eventId });
    if (!event) {
      throw new NotFoundException(`Event with id ${props.eventId} not found`);
    }

    const issue = this.issuesRepo.create(props);
    issue.agencyId = event.agencyId;
    return this.lem.create(this.issuesRepo, issue, createdBy);
  }

  async update(id: number, props: UpdateIssueDto, updatedBy: User) {
    const issue = Object.assign(await this.findOne(id), props);
    return this.lem.update(this.issuesRepo, issue, updatedBy);
  }

  async remove(id: number, deletedBy: User) {
    const issue = await this.findOne(id);
    return this.lem.remove(this.issuesRepo, issue, deletedBy);
  }
}
