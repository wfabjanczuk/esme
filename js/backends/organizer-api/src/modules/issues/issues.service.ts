import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue, IssueStatus } from './issue.entity';
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

  async findOne(id: number, agencyId: number) {
    const issue = await this.issuesRepo.findOneBy({
      id,
      agencyId,
    });
    if (!issue) {
      throw new NotFoundException(
        `Issue with id ${id} not found in agency ${agencyId}`,
      );
    }
    return issue;
  }

  findAll(options: FindIssuesOptionsDto) {
    return this.issuesRepo.find({ where: options });
  }

  async create(props: CreateIssueDto, createdBy: User) {
    const event = await this.eventsRepo.findOneBy({ id: props.eventId });
    if (!event) {
      throw new NotFoundException(
        `Event with id ${props.eventId} not found in agency ${createdBy.agencyId}`,
      );
    }

    const issue = this.issuesRepo.create(props);
    issue.status = IssueStatus.toDo;
    issue.timeCreated = new Date();
    issue.authorId = createdBy.id;
    issue.agencyId = createdBy.agencyId;

    return this.lem.create(this.issuesRepo, issue, createdBy);
  }

  async update(id: number, props: UpdateIssueDto, updatedBy: User) {
    const issue = Object.assign(
      await this.findOne(id, updatedBy.agencyId),
      props,
    );

    if (
      issue.status == IssueStatus.cancelled ||
      issue.status == IssueStatus.resolved
    ) {
      issue.timeClosed = new Date();
    }
    return this.lem.update(this.issuesRepo, issue, updatedBy);
  }

  async remove(id: number, deletedBy: User) {
    const issue = await this.findOne(id, deletedBy.agencyId);
    return this.lem.remove(this.issuesRepo, issue, deletedBy);
  }
}
