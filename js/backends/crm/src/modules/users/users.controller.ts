import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
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
import { AdminGuard } from '../../common/guards/admin.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { AdminRoles } from './user-role.enum';

@Controller('users')
@UseGuards(AuthenticationGuard, AdminGuard)
@Serialize(PublicUserDto)
@ApiTags('1. Admin: users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('roles')
  @Header('Content-Type', 'application/json; charset=utf-8')
  @ApiResponse({
    status: 200,
    schema: {
      example: JSON.stringify(AdminRoles),
    },
  })
  getAdminRoles() {
    return JSON.stringify(AdminRoles);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: User,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'User with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param() { id }: IdDto) {
    return this.usersService.findOne(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [User],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
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
  create(@CurrentUser() currentUser: User, @Body() body: CreateUserDto) {
    return this.usersService.create(body, currentUser);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: User,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'User with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  update(
    @CurrentUser() currentUser: User,
    @Param() { id }: IdDto,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body, currentUser);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: User,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'User with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  async remove(
    @CurrentUser() currentUser: User,
    @Session() session: any,
    @Param() { id }: IdDto,
  ) {
    const removedUser = await this.usersService.remove(id, currentUser);
    if (id === session.userId) {
      session.userId = undefined;
    }
    return removedUser;
  }
}
