import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dtos/sign-in.dto';
import {
  AuthenticationService,
  signInErrorMessage,
} from './authentication.service';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { AuthenticatedUserDto } from './dtos/authenticated-user.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { User } from './user.entity';

@Controller('auth')
@Serialize(AuthenticatedUserDto)
@ApiTags('0. Authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('sign-in')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: AuthenticatedUserDto,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 400,
        message: signInErrorMessage,
        error: 'Bad Request',
      },
    },
  })
  async signIn(@Body() { email, password }: SignInDto) {
    return await this.authenticationService.authenticate(email, password);
  }

  @Post('sign-out')
  @UseGuards(AuthenticationGuard)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully signed out.',
  })
  async signOut(@CurrentUser() currentUser: User) {
    await this.authenticationService.signOut(currentUser);
  }
}
