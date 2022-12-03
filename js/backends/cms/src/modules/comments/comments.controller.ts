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
import { AuthGuard } from '../../guards/auth.guard';
import { IssuesService } from '../issues/issues.service';
import { CommentsService } from './comments.service';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Comment } from './comment.entity';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Controller('comments')
@ApiTags('Comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(
    private issuesService: IssuesService,
    private commentsService: CommentsService,
  ) {}

  @Post('')
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
  async create(@CurrentUser() currentUser, @Body() body: CreateCommentDto) {
    const issue = await this.issuesService.findOne(body.issueId);
    return this.commentsService.create(body, issue, currentUser);
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
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(parseInt(id));
  }

  @Get('')
  @ApiResponse({
    status: 200,
    type: [Comment],
  })
  async findAll(@Query('issueId') issueId?: string) {
    const issue = issueId
      ? await this.issuesService.findOne(parseInt(issueId))
      : null;
    return this.commentsService.findAll(issue);
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
    @CurrentUser() currentUser,
    @Param('id') id: string,
    @Body() body: UpdateCommentDto,
  ) {
    return this.commentsService.update(parseInt(id), body, currentUser);
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
  async remove(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.commentsService.remove(parseInt(id), currentUser);
  }
}
