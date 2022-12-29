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
import { AnnouncementsService } from './announcements.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateAnnouncementDto } from './dtos/create-announcement.dto';
import { Announcement } from './announcement.entity';
import { UpdateAnnouncementDto } from './dtos/update-announcement.dto';
import { IdDto } from '../../common/dtos/id.dto';
import { AdminGuard } from '../../common/guards/admin.guard';
import { FindAnnouncementsOptionsDto } from './dtos/find-announcements-options.dto';

@Controller('announcements')
@UseGuards(AuthenticationGuard, AdminGuard)
@ApiTags('1. Admin: announcements')
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: Announcement,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Event with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  async create(
    @CurrentUser() currentUser,
    @Body() body: CreateAnnouncementDto,
  ) {
    return this.announcementsService.create(body, currentUser);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Announcement,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Announcement with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param() { id }: IdDto) {
    return this.announcementsService.findOne(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Announcement],
  })
  async findAll(@Query() options: FindAnnouncementsOptionsDto) {
    return this.announcementsService.findAll(options);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: Announcement,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Announcement with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  update(
    @CurrentUser() currentUser,
    @Param() { id }: IdDto,
    @Body() body: UpdateAnnouncementDto,
  ) {
    return this.announcementsService.update(id, body, currentUser);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: Announcement,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Announcement with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  async remove(@CurrentUser() currentUser, @Param() { id }: IdDto) {
    return this.announcementsService.remove(id, currentUser);
  }
}
