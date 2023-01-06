import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { Changelog } from './changelog.entity';
import { ChangelogsService } from './changelogs.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { FindAgencyChangelogsOptionsDto } from './dtos/find-agency-changelogs-options.dto';
import { AgencySupportGuard } from '../../common/guards/agency-support.guard';

@Controller('agency/changelogs')
@UseGuards(AuthenticationGuard, AgencySupportGuard)
@ApiTags('2. Agency: changelogs')
export class AgencyChangelogsController {
  constructor(private changelogsService: ChangelogsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: [Changelog],
  })
  findAll(
    @CurrentUser() { agencyId }: User,
    @Query() options: FindAgencyChangelogsOptionsDto,
  ) {
    return this.changelogsService.findAll({
      ...options,
      userAgencyId: agencyId,
    });
  }
}
