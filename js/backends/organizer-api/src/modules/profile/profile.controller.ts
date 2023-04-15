import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PublicUserDto } from '../users/dtos/public-user.dto';
import { ProfileService } from './profile.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AdminGuard } from '../../common/guards/admin.guard';
import { SetAgencyDto } from './dtos/set-agency.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

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
  updateProfile(
    @CurrentUser() currentUser: User,
    @Body() body: UpdateProfileDto,
  ) {
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

  @Patch('set-agency')
  @UseGuards(AdminGuard)
  @ApiResponse({
    status: 200,
    type: User,
  })
  setAgency(@CurrentUser() currentUser: User, @Body() body: SetAgencyDto) {
    return this.profileService.setAgency(body, currentUser);
  }
}
