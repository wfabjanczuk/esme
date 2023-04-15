import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { Changelog } from '../changelogs/changelog.entity';
import { AdminChangelogsService } from './admin-changelogs.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import { FindChangelogsOptionsDto } from './dtos/find-changelogs-options.dto';
import { IdDto } from '../../common/dtos/id.dto';

@Controller('admin/changelogs')
@UseGuards(AuthenticationGuard, AdminGuard)
@ApiTags('1. Admin: changelogs')
export class AdminChangelogsController {
  constructor(private adminChangelogsService: AdminChangelogsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: [Changelog],
  })
  findAll(@Query() options: FindChangelogsOptionsDto) {
    return this.adminChangelogsService.findAllAdminChangelogs(options);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Changelog,
  })
  findOne(@Param() { id }: IdDto) {
    return this.adminChangelogsService.findOne(id);
  }
}
