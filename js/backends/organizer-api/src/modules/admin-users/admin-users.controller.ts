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
import { AdminUsersService } from './admin-users.service';
import { User } from '../users/user.entity';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IdDto } from '../../common/dtos/id.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PublicUserDto } from '../users/dtos/public-user.dto';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminRoles } from '../users/user-role.enum';
import { UpdateAdminUserDto } from './dtos/update-admin-user.dto';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Controller('admin/users')
@UseGuards(AuthenticationGuard, AdminGuard)
@Serialize(PublicUserDto)
@ApiTags('1. Admin: users')
export class AdminUsersController {
  constructor(private adminUsersService: AdminUsersService) {}

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
    return this.adminUsersService.findOne(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [User],
  })
  findAll() {
    return this.adminUsersService.findAllAdmins();
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
    return this.adminUsersService.create(body, currentUser);
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
    @Body() body: UpdateAdminUserDto,
  ) {
    return this.adminUsersService.update(id, body, currentUser);
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
  async remove(@CurrentUser() currentUser: User, @Param() { id }: IdDto) {
    return await this.adminUsersService.remove(id, currentUser);
  }
}
