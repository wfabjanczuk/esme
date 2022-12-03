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
import { EventsService } from '../events/events.service';
import { AnnouncementsService } from './announcements.service';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { CreateAnnouncementDto } from './dtos/create-announcement.dto';
import { Announcement } from './announcement.entity';
import { UpdateAnnouncementDto } from './dtos/update-announcement.dto';

@Controller('announcements')
@ApiTags('Announcements')
@UseGuards(AuthGuard)
export class AnnouncementsController {
  constructor(
    private eventsService: EventsService,
    private announcementsService: AnnouncementsService,
  ) {}

  @Post('')
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
  async createAnnouncement(
    @CurrentUser() currentUser,
    @Body() body: CreateAnnouncementDto,
  ) {
    const event = await this.eventsService.findOne(body.eventId);
    return this.announcementsService.create(body, event, currentUser);
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
  findAnnouncementById(@Param('id') id: string) {
    return this.announcementsService.findOne(parseInt(id));
  }

  @Get('')
  @ApiResponse({
    status: 200,
    type: [Announcement],
  })
  findAllAnnouncements(@Query('eventId') eventId?: string) {
    return this.announcementsService.findAll(eventId);
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
  updateAnnouncement(
    @CurrentUser() currentUser,
    @Param('id') id: string,
    @Body() body: UpdateAnnouncementDto,
  ) {
    return this.announcementsService.update(parseInt(id), body, currentUser);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
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
  async removeAnnouncement(
    @CurrentUser() currentUser,
    @Param('id') id: string,
  ) {
    return this.announcementsService.remove(parseInt(id), currentUser);
  }
}
