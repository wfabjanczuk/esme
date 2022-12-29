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
import { ContactsService } from './contacts.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateContactDto } from './dtos/create-contact.dto';
import { Contact } from './contact.entity';
import { UpdateContactDto } from './dtos/update-contact.dto';
import { IdDto } from '../../common/dtos/id.dto';
import { AdminGuard } from '../../common/guards/admin.guard';
import { FindContactsOptionsDto } from './dtos/find-contacts-options.dto';
import { User } from '../users/user.entity';

@Controller('contacts')
@UseGuards(AuthenticationGuard, AdminGuard)
@ApiTags('1. Admin: contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Post()
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
  async create(
    @CurrentUser() currentUser: User,
    @Body() body: CreateContactDto,
  ) {
    return this.contactsService.create(body, currentUser);
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
  findOne(@Param() { id }: IdDto) {
    return this.contactsService.findOne(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Contact],
  })
  async findAll(@Query() options: FindContactsOptionsDto) {
    return this.contactsService.findAll(options);
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
    @CurrentUser() currentUser: User,
    @Param() { id }: IdDto,
    @Body() body: UpdateContactDto,
  ) {
    return this.contactsService.update(id, body, currentUser);
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
  async remove(@CurrentUser() currentUser: User, @Param() { id }: IdDto) {
    return this.contactsService.remove(id, currentUser);
  }
}
