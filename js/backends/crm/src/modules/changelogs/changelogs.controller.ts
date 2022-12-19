import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { Changelog } from './changelog.entity';
import { ChangelogsService } from './changelogs.service';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('changelogs')
@UseGuards(AuthenticationGuard, AdminGuard)
@ApiTags('1. Admin: changelogs')
export class ChangelogsController {
  constructor(private changelogsService: ChangelogsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: [Changelog],
  })
  findAll() {
    return this.changelogsService.findAll();
  }
}
