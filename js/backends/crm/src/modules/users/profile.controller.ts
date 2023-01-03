import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PublicUserDto } from './dtos/public-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ProfileService } from './profile.service';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Controller('profile')
@UseGuards(AuthenticationGuard)
@Serialize(PublicUserDto)
@ApiTags('0. Profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: User,
  })
  getProfile(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Patch()
  @ApiResponse({
    status: 200,
    type: User,
  })
  updateProfile(@CurrentUser() currentUser: User, @Body() body: UpdateUserDto) {
    return this.profileService.update(body, currentUser);
  }

  @Patch('change-password')
  @ApiResponse({
    status: 200,
    type: User,
  })
  changePassword(
    @CurrentUser() currentUser: User,
    @Body() body: ChangePasswordDto,
  ) {
    return this.profileService.changePassword(body, currentUser);
  }
}
