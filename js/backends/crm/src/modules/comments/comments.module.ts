import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { IssuesModule } from '../issues/issues.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), IssuesModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
