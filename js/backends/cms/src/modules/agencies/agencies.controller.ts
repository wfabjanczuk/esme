import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { Agency } from './agency.entity';
import { AuthGuard } from '../../guards/auth.guard';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAgencyDto } from './dtos/create-agency.dto';
import { UpdateAgencyDto } from './dtos/update-agency.dto';
import { EventsService } from '../events/events.service';
import { CurrentUser } from '../../decorators/current-user.decorator';

@Controller('agencies')
@ApiTags('Agencies')
@UseGuards(AuthGuard)
export class AgenciesController {
  constructor(
    private agenciesService: AgenciesService,
    private eventsService: EventsService,
  ) {}

  @Post('')
  @ApiResponse({
    status: 201,
    type: Agency,
  })
  @ApiBadRequestResponse({
    schema: {
      example: {
        statusCode: 400,
        message: 'Name is already taken',
        error: 'Bad Request',
      },
    },
  })
  createAgency(@CurrentUser() currentUser, @Body() body: CreateAgencyDto) {
    return this.agenciesService.create(body, currentUser);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Agency,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Agency with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  findAgencyById(@Param('id') id: string) {
    return this.agenciesService.findOne(parseInt(id));
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Agency],
  })
  findAllAgencies() {
    return this.agenciesService.findAll();
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: Agency,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Agency with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  updateAgency(
    @CurrentUser() currentUser,
    @Param('id') id: string,
    @Body() body: UpdateAgencyDto,
  ) {
    return this.agenciesService.update(parseInt(id), body, currentUser);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    type: Agency,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Agency with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  async removeAgency(@CurrentUser() currentUser, @Param('id') id: string) {
    const agencyEventsCount = await this.eventsService.countAll(id);
    if (agencyEventsCount) {
      throw new BadRequestException('Agency has existing events');
    }
    return this.agenciesService.remove(parseInt(id), currentUser);
  }
}
