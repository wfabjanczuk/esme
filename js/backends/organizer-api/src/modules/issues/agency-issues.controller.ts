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
import { Issue } from './issue.entity';
import { CreateIssueDto } from './dtos/create-issue.dto';
import { UpdateIssueDto } from './dtos/update-issue.dto';
import { IdDto } from '../../common/dtos/id.dto';
import { User } from '../users/user.entity';
import { AgencySupportGuard } from '../../common/guards/agency-support.guard';
import { AgencyIssuesService } from './agency-issues.service';
import { FindAgencyIssuesOptionsDto } from './dtos/find-agency-issues-options.dto';

@Controller('agency/issues')
@UseGuards(AuthenticationGuard, AgencySupportGuard)
@ApiTags('2. Agency: issues')
export class AgencyIssuesController {
  constructor(private agencyIssuesService: AgencyIssuesService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: Issue,
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
  create(@CurrentUser() currentUser: User, @Body() body: CreateIssueDto) {
    return this.agencyIssuesService.create(body, currentUser);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Issue,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Issue with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  findOne(@CurrentUser() { agencyId }: User, @Param() { id }: IdDto) {
    return this.agencyIssuesService.findOne(id, agencyId);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Issue],
  })
  findAll(
    @CurrentUser() { agencyId }: User,
    @Query() options: FindAgencyIssuesOptionsDto,
  ) {
    return this.agencyIssuesService.findAll({ ...options, agencyId });
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: Issue,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Issue with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  update(
    @CurrentUser() currentUser: User,
    @Param() { id }: IdDto,
    @Body() body: UpdateIssueDto,
  ) {
    return this.agencyIssuesService.update(id, body, currentUser);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: Issue,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Issue with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  remove(@CurrentUser() currentUser: User, @Param() { id }: IdDto) {
    return this.agencyIssuesService.remove(id, currentUser);
  }
}
