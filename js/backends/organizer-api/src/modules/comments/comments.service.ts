import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../users/user.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { FindCommentsOptionsDto } from './dtos/find-comments-options.dto';
import { Issue } from '../issues/issue.entity';

@Injectable()
export class CommentsService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(Comment) private commentsRepo: Repository<Comment>,
    @InjectRepository(Issue) private issuesRepo: Repository<Issue>,
  ) {}

  async findOne(id: number) {
    const comment = await this.commentsRepo.findOneBy({ id });
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  findAll(options: FindCommentsOptionsDto) {
    return this.commentsRepo.find({ where: options });
  }

  async create(props: CreateCommentDto, createdBy: User) {
    const issue = await this.issuesRepo.findOneBy({ id: props.issueId });
    if (!issue) {
      throw new NotFoundException(`Issue with id ${props.issueId} not found`);
    }

    const comment = this.commentsRepo.create(props);
    comment.agencyId = issue.agencyId;
    return this.lem.create(this.commentsRepo, comment, createdBy);
  }

  async update(id: number, props: UpdateCommentDto, updatedBy: User) {
    const comment = Object.assign(await this.findOne(id), props);
    return this.lem.update(this.commentsRepo, comment, updatedBy);
  }

  async remove(id: number, deletedBy: User) {
    const comment = await this.findOne(id);
    return this.lem.remove(this.commentsRepo, comment, deletedBy);
  }
}