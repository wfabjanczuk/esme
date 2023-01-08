import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from './user.entity';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IdDto } from '../../common/dtos/id.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PublicUserDto } from './dtos/public-user.dto';
import { AgencyRoles } from './user-role.enum';
import { AgencyManagerGuard } from '../../common/guards/agency-manager.guard';
import { AgencyUsersService } from './agency-users.service';
import { CreateAgencyUserDto } from './dtos/create-agency-user.dto';
import { AgencySupportGuard } from '../../common/guards/agency-support.guard';

@Controller('agency/users')
@UseGuards(AuthenticationGuard)
@Serialize(PublicUserDto)
@ApiTags('2. Organizer: users')
export class AgencyUsersController {
  constructor(private agencyUsersService: AgencyUsersService) {}

  @Get('roles')
  @Header('Content-Type', 'application/json; charset=utf-8')
  @UseGuards(AgencySupportGuard)
  @ApiResponse({
    status: 200,
    schema: {
      example: JSON.stringify(AgencyRoles),
    },
  })
  getAdminRoles() {
    return JSON.stringify(AgencyRoles);
  }

  @Get(':id')
  @UseGuards(AgencySupportGuard)
  @ApiResponse({
    status: 200,
    type: User,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'User with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  findOne(@CurrentUser() { agencyId }: User, @Param() { id }: IdDto) {
    return this.agencyUsersService.findOne(id, agencyId);
  }

  @Get()
  @UseGuards(AgencySupportGuard)
  @ApiResponse({
    status: 200,
    type: [User],
  })
  findAll(@CurrentUser() { agencyId }: User) {
    return this.agencyUsersService.findAll(agencyId);
  }

  @Post()
  @UseGuards(AgencyManagerGuard)
  @ApiResponse({
    status: 201,
    type: User,
  })
  @ApiBadRequestResponse({
    schema: {
      example: {
        statusCode: 400,
        message: 'Email is already taken',
        error: 'Bad Request',
      },
    },
  })
  create(@CurrentUser() currentUser: User, @Body() body: CreateAgencyUserDto) {
    return this.agencyUsersService.create(body, currentUser);
  }

  @Patch(':id')
  @UseGuards(AgencyManagerGuard)
  @ApiResponse({
    status: 200,
    type: User,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'User with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  update(
    @CurrentUser() currentUser: User,
    @Param() { id }: IdDto,
    @Body() body: UpdateUserDto,
  ) {
    return this.agencyUsersService.update(id, body, currentUser);
  }

  @Delete(':id')
  @UseGuards(AgencyManagerGuard)
  @ApiResponse({
    status: 200,
    type: User,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'User with id 1 not found in agency 1',
        error: 'Not Found',
      },
    },
  })
  async remove(@CurrentUser() currentUser: User, @Param() { id }: IdDto) {
    return await this.agencyUsersService.remove(id, currentUser);
  }
}
