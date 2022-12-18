import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../users/user.entity';
import { Issue } from '../issues/issue.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(Comment) private repo: Repository<Comment>,
  ) {}

  async findOne(id: number) {
    const comment = await this.repo.findOneBy({ id });
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  findAll(issue?: Issue) {
    if (!issue) {
      return this.repo.find();
    }
    return this.repo.find({
      where: {
        issue: {
          id: issue.id,
        },
      },
    });
  }

  async create(props: CreateCommentDto, issue: Issue, createdBy: User) {
    const comment = this.repo.create(props);
    comment.issue = issue;
    return this.lem.create(this.repo, comment, createdBy);
  }

  async update(id: number, props: UpdateCommentDto, updatedBy: User) {
    const comment = Object.assign(await this.findOne(id), props);
    return this.lem.update(this.repo, comment, updatedBy);
  }

  async remove(id: number, deletedBy: User) {
    const comment = await this.findOne(id);
    return this.lem.remove(this.repo, comment, deletedBy);
  }
}
