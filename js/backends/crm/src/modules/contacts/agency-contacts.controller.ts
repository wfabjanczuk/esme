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
import { CreateContactDto } from './dtos/create-contact.dto';
import { Contact } from './contact.entity';
import { UpdateContactDto } from './dtos/update-contact.dto';
import { IdDto } from '../../common/dtos/id.dto';
import { User } from '../users/user.entity';
import { AgencyManagerGuard } from '../../common/guards/agency-manager.guard';
import { AgencySupportGuard } from '../../common/guards/agency-support.guard';
import { FindAgencyContactsOptionsDto } from './dtos/find-agency-contacts-options.dto';
import { AgencyContactsService } from './agency-contacts.service';

@Controller('agency/contacts')
@UseGuards(AuthenticationGuard)
@ApiTags('2. Agency: contacts')
export class AgencyContactsController {
  constructor(private agencyContactsService: AgencyContactsService) {}

  @Post()
  @UseGuards(AgencyManagerGuard)
  @ApiResponse({
    status: 201,
    type: Contact,
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
  create(@CurrentUser() currentUser: User, @Body() body: CreateContactDto) {
    return this.agencyContactsService.create(body, currentUser);
  }

  @Get(':id')
  @UseGuards(AgencySupportGuard)
  @ApiResponse({
    status: 200,
    type: Contact,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Contact with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  findOne(@CurrentUser() { agencyId }: User, @Param() { id }: IdDto) {
    return this.agencyContactsService.findOne(id, agencyId);
  }

  @Get()
  @UseGuards(AgencySupportGuard)
  @ApiResponse({
    status: 200,
    type: [Contact],
  })
  findAll(
    @CurrentUser() { agencyId }: User,
    @Query() options: FindAgencyContactsOptionsDto,
  ) {
    return this.agencyContactsService.findAll({ ...options, agencyId });
  }

  @Patch(':id')
  @UseGuards(AgencyManagerGuard)
  @ApiResponse({
    status: 200,
    type: Contact,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Contact with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  update(
    @CurrentUser() currentUser: User,
    @Param() { id }: IdDto,
    @Body() body: UpdateContactDto,
  ) {
    return this.agencyContactsService.update(id, body, currentUser);
  }

  @Delete(':id')
  @UseGuards(AgencyManagerGuard)
  @ApiResponse({
    status: 200,
    type: Contact,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Contact with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  remove(@CurrentUser() currentUser: User, @Param() { id }: IdDto) {
    return this.agencyContactsService.remove(id, currentUser);
  }
}
