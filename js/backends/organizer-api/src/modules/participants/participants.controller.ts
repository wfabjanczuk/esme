import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AgencySupportGuard } from '../../common/guards/agency-support.guard';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdDto } from '../../common/dtos/id.dto';
import { ParticipantsService } from './participants.service';
import { Participant } from './participant.entity';

@Controller('participants')
@ApiTags('2. Organizer: participants')
@UseGuards(AuthenticationGuard, AgencySupportGuard)
export class ParticipantsController {
  constructor(private participantsService: ParticipantsService) {}

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Participant,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Participant with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param() { id }: IdDto) {
    return this.participantsService.findOne(id);
  }
}
