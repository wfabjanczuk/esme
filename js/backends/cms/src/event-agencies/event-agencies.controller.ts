import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { EventAgenciesService } from './event-agencies.service';
import { EventAgency } from './event-agency.entity';
import { AuthGuard } from '../guards/auth.guard';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateEventAgencyDto,
  UpdateEventAgencyDto,
  VerifyAgentAgencyDto,
} from './dtos';

@Controller('event-agencies')
@ApiTags('Event agencies')
@UseGuards(AuthGuard)
export class EventAgenciesController {
  constructor(private eventAgenciesService: EventAgenciesService) {}

  @Post('')
  @ApiResponse({
    status: 201,
    type: EventAgency,
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
  createEventAgency(@Body() body: CreateEventAgencyDto) {
    return this.eventAgenciesService.create(body);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: EventAgency,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Event agency with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  findEventAgencyById(@Param('id') id: string) {
    return this.eventAgenciesService.findOne(parseInt(id));
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [EventAgency],
  })
  findAllEventAgencies() {
    return this.eventAgenciesService.findAll();
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: EventAgency,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Event agency with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  updateEventAgency(
    @Param('id') id: string,
    @Body() body: UpdateEventAgencyDto,
  ) {
    return this.eventAgenciesService.update(parseInt(id), body);
  }

  @Patch(':id/verify')
  @ApiResponse({
    status: 200,
    type: EventAgency,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Event agency with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  verifyEventAgency(
    @Param('id') id: string,
    @Body() body: VerifyAgentAgencyDto,
  ) {
    return this.eventAgenciesService.verify(parseInt(id), body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    type: EventAgency,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Event agency with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  async removeEventAgency(
    @Session() session: any,
    @Param('id') paramId: string,
  ) {
    const id = parseInt(paramId);
    const removedEventAgency = await this.eventAgenciesService.remove(id);
    return Object.assign(removedEventAgency, { id });
  }
}
