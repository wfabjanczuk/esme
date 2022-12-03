import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from './issue.entity';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';
import { CreateIssueDto } from './dtos/create-issue.dto';
import { UpdateIssueDto } from './dtos/update-issue.dto';

@Injectable()
export class IssuesService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(Issue) private repo: Repository<Issue>,
  ) {}

  async findOne(id: number) {
    const issue = await this.repo.findOneBy({ id });
    if (!issue) {
      throw new NotFoundException(`Issue with id ${id} not found`);
    }
    return issue;
  }

  findAll(event?: Event) {
    if (!event) {
      return this.repo.find();
    }
    return this.repo.find({
      where: {
        event: {
          id: event.id,
        },
      },
    });
  }

  async create(props: CreateIssueDto, event: Event, createdBy?: User) {
    const issue = this.repo.create(props);
    issue.event = event;
    return this.lem.create(this.repo, issue, createdBy);
  }

  async update(id: number, props: UpdateIssueDto, updatedBy?: User) {
    const issue = Object.assign(await this.findOne(id), props);
    return this.lem.update(this.repo, issue, updatedBy);
  }

  async remove(id: number, deletedBy?: User) {
    const issue = await this.findOne(id);
    return this.lem.remove(this.repo, issue, deletedBy);
  }
}
