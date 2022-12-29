import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { IssuesModule } from '../issues/issues.module';
import { Issue } from '../issues/issue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Issue]), IssuesModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
