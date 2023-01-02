import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Issue } from '../issues/issue.entity';
import { AgencyCommentsController } from './agency-comments.controller';
import { AgencyCommentsService } from './agency-comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Issue])],
  controllers: [CommentsController, AgencyCommentsController],
  providers: [CommentsService, AgencyCommentsService],
})
export class CommentsModule {}
