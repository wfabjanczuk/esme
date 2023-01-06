import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { CommentsService } from './comments.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Comment } from './comment.entity';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { IdDto } from '../../common/dtos/id.dto';
import { AdminGuard } from '../../common/guards/admin.guard';
import { FindCommentsOptionsDto } from './dtos/find-comments-options.dto';
import { User } from '../users/user.entity';

@Controller('comments')
@UseGuards(AuthenticationGuard, AdminGuard)
@ApiTags('1. Admin: comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: Comment,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Issue with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  create(@CurrentUser() currentUser: User, @Body() body: CreateCommentDto) {
    return this.commentsService.create(body, currentUser);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Comment,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Comment with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param() { id }: IdDto) {
    return this.commentsService.findOne(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Comment],
  })
  findAll(@Query() options: FindCommentsOptionsDto) {
    return this.commentsService.findAll(options);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: Comment,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Comment with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  update(
    @CurrentUser() currentUser: User,
    @Param() { id }: IdDto,
    @Body() body: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, body, currentUser);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: Comment,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Comment with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  remove(@CurrentUser() currentUser: User, @Param() { id }: IdDto) {
    return this.commentsService.remove(id, currentUser);
  }
}
