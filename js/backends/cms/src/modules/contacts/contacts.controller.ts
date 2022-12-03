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
import { ContactsService } from './contacts.service';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { CreateContactDto } from './dtos/create-contact.dto';
import { Contact } from './contact.entity';
import { UpdateContactDto } from './dtos/update-contact.dto';

@Controller('contacts')
@ApiTags('Contacts')
@UseGuards(AuthGuard)
export class ContactsController {
  constructor(
    private eventsService: EventsService,
    private contactsService: ContactsService,
  ) {}

  @Post('')
  @ApiResponse({
    status: 201,
    type: Contact,
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
  async create(@CurrentUser() currentUser, @Body() body: CreateContactDto) {
    const event = await this.eventsService.findOne(body.eventId);
    return this.contactsService.create(body, event, currentUser);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Contact,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Contact with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(parseInt(id));
  }

  @Get('')
  @ApiResponse({
    status: 200,
    type: [Contact],
  })
  async findAll(@Query('eventId') eventId?: string) {
    const event = eventId
      ? await this.eventsService.findOne(parseInt(eventId))
      : null;
    return this.contactsService.findAll(event);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: Contact,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Contact with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  update(
    @CurrentUser() currentUser,
    @Param('id') id: string,
    @Body() body: UpdateContactDto,
  ) {
    return this.contactsService.update(parseInt(id), body, currentUser);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: Contact,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Contact with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  async remove(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.contactsService.remove(parseInt(id), currentUser);
  }
}
