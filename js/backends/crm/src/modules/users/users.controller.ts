import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IdDto } from '../../common/dtos/id.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PublicUserDto } from './dtos/public-user.dto';

@Controller('users')
@UseGuards(AuthenticationGuard)
@Serialize(PublicUserDto)
@ApiTags('1. Admin: users')
export class UsersController {
  constructor(private usersService: UsersService) {}

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
  async update(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
  ) {
    return await this.usersService.update(id, body, currentUser);
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
    @Param('id') paramId: string,
  ) {
    const id = parseInt(paramId);
    if (id !== session.userId) {
      return await this.usersService.remove(id, currentUser);
    }

    const removedUser = await this.usersService.remove(id, undefined);
    session.userId = undefined;
    return removedUser;
  }
}
