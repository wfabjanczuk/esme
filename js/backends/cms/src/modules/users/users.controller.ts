import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninUserDto } from './dtos/signin-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  @ApiResponse({
    status: 201,
    type: User,
  })
  @ApiBadRequestResponse({
    schema: {
      example: {
        statusCode: 400,
        message: 'Email or phone number is already taken',
        error: 'Bad Request',
      },
    },
  })
  async createUser(
    @CurrentUser() currentUser: User,
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.usersService.create(body, currentUser);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: User,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'User with email jan@kowalski.com not found',
        error: 'Not Found',
      },
    },
  })
  async signIn(@Body() body: SigninUserDto, @Session() session: any) {
    const user = await this.usersService.findByEmail(body.email);
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
  })
  signOut(@Session() session: any) {
    session.userId = undefined;
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    type: User,
  })
  whoAmI(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
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
  findUserById(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    type: [User],
  })
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
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
  async updateUser(
    @CurrentUser() currentUser: User,
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ) {
    return await this.usersService.update(parseInt(id), body, currentUser);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
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
  async removeUser(
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