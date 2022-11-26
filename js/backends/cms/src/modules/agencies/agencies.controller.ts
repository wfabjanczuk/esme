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
  createAgency(@Body() body: CreateAgencyDto) {
    return this.agenciesService.create(body);
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
  updateAgency(@Param('id') id: string, @Body() body: UpdateAgencyDto) {
    return this.agenciesService.update(parseInt(id), body);
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
  async removeAgency(@Param('id') paramId: string) {
    const agencyEventsCount = this.eventsService.countAll(paramId);
    if (agencyEventsCount) {
      throw new BadRequestException('Agency has existing events');
    }
    const id = parseInt(paramId);
    const removedAgency = await this.agenciesService.remove(id);
    return Object.assign(removedAgency, { id });
  }
}
