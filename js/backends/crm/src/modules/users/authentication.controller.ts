import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User, UserRole } from './user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthenticationService } from './authentication.service';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PublicUserDto } from './dtos/public-user.dto';

@Controller('auth')
@Serialize(PublicUserDto)
@ApiTags('0. Authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('sign-in')
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
  async signIn(
    @Body() { email, password }: SignInDto,
    @Session() session: any,
  ) {
    const user = await this.authenticationService.authenticate(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('sign-out')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  @ApiResponse({
    status: 200,
  })
  signOut(@Session() session: any) {
    session.userId = undefined;
  }

  @Get('who-am-i')
  @UseGuards(AuthenticationGuard)
  @ApiResponse({
    status: 200,
    type: User,
  })
  whoAmI(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Delete('delete-account')
  @UseGuards(AuthenticationGuard)
  @ApiResponse({
    status: 200,
    type: User,
  })
  async deleteAccount(
    @CurrentUser() currentUser: User,
    @Session() session: any,
  ) {
    if (currentUser.role === UserRole.agencyOwner) {
      throw new BadRequestException(
        'Cannot remove just an agency owner. Delete whole agency instead',
      );
    }

    const removedUser = await this.authenticationService.deleteAccount(
      currentUser,
    );
    session.userId = undefined;
    return removedUser;
  }
}
