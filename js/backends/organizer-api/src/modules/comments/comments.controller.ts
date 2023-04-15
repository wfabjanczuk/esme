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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Comment } from './comment.entity';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { IdDto } from '../../common/dtos/id.dto';
import { User } from '../users/user.entity';
import { AgencySupportGuard } from '../../common/guards/agency-support.guard';
import { CommentsService } from './comments.service';
import { FindAgencyCommentsOptionsDto } from './dtos/find-agency-comments-options.dto';

@Controller('agency/comments')
@UseGuards(AuthenticationGuard, AgencySupportGuard)
@ApiTags('2. Organizer: comments')
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
        message: 'Issue with id 1 not found in agency 1',
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
        message: 'Comment with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  findOne(@CurrentUser() { agencyId }: User, @Param() { id }: IdDto) {
    return this.commentsService.findOne(id, agencyId);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Comment],
  })
  findAll(
    @CurrentUser() { agencyId }: User,
    @Query() options: FindAgencyCommentsOptionsDto,
  ) {
    return this.commentsService.findAll({ ...options, agencyId });
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
        message: 'Comment with id 1 not found in agency 1',
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
        message: 'Comment with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  remove(@CurrentUser() currentUser: User, @Param() { id }: IdDto) {
    return this.commentsService.remove(id, currentUser);
  }
}
