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
import { CreateAnnouncementDto } from './dtos/create-announcement.dto';
import { Announcement } from './announcement.entity';
import { UpdateAnnouncementDto } from './dtos/update-announcement.dto';
import { IdDto } from '../../common/dtos/id.dto';
import { AgencyAnnouncementsService } from './agency-announcements.service';
import { User } from '../users/user.entity';
import { FindAgencyAnnouncementsOptionsDto } from './dtos/find-agency-announcements-options.dto';
import { AgencyManagerGuard } from '../../common/guards/agency-manager.guard';
import { AgencySupportGuard } from '../../common/guards/agency-support.guard';

@Controller('agency/announcements')
@UseGuards(AuthenticationGuard)
@ApiTags('2. Organizer: announcements')
export class AgencyAnnouncementsController {
  constructor(private agencyAnnouncementsService: AgencyAnnouncementsService) {}

  @Post()
  @UseGuards(AgencyManagerGuard)
  @ApiResponse({
    status: 201,
    type: Announcement,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Event with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  create(
    @CurrentUser() currentUser: User,
    @Body() body: CreateAnnouncementDto,
  ) {
    return this.agencyAnnouncementsService.create(body, currentUser);
  }

  @Get(':id')
  @UseGuards(AgencySupportGuard)
  @ApiResponse({
    status: 200,
    type: Announcement,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Announcement with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  findOne(@CurrentUser() { agencyId }: User, @Param() { id }: IdDto) {
    return this.agencyAnnouncementsService.findOne(id, agencyId);
  }

  @Get()
  @UseGuards(AgencySupportGuard)
  @ApiResponse({
    status: 200,
    type: [Announcement],
  })
  findAll(
    @CurrentUser() { agencyId }: User,
    @Query() options: FindAgencyAnnouncementsOptionsDto,
  ) {
    return this.agencyAnnouncementsService.findAll({ ...options, agencyId });
  }

  @Patch(':id')
  @UseGuards(AgencyManagerGuard)
  @ApiResponse({
    status: 200,
    type: Announcement,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Announcement with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  update(
    @CurrentUser() currentUser: User,
    @Param() { id }: IdDto,
    @Body() body: UpdateAnnouncementDto,
  ) {
    return this.agencyAnnouncementsService.update(id, body, currentUser);
  }

  @Delete(':id')
  @UseGuards(AgencyManagerGuard)
  @ApiResponse({
    status: 200,
    type: Announcement,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Announcement with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  remove(@CurrentUser() currentUser: User, @Param() { id }: IdDto) {
    return this.agencyAnnouncementsService.remove(id, currentUser);
  }
}
