import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { Changelog } from './changelog.entity';
import { ChangelogsService } from './changelogs.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { FindAgencyChangelogsOptionsDto } from './dtos/find-agency-changelogs-options.dto';
import { AgencySupportGuard } from '../../common/guards/agency-support.guard';
import { IdDto } from '../../common/dtos/id.dto';

@Controller('agency/changelogs')
@UseGuards(AuthenticationGuard, AgencySupportGuard)
@ApiTags('2. Organizer: changelogs')
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
      agencyId: agencyId,
    });
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Changelog,
  })
  findOne(@CurrentUser() { agencyId }: User, @Param() { id }: IdDto) {
    return this.changelogsService.findOne(id, agencyId);
  }
}
