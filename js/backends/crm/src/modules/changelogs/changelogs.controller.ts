import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { Changelog } from './changelog.entity';
import { ChangelogsService } from './changelogs.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import { FindChangelogsOptionsDto } from './dtos/find-changelogs-options.dto';

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
  findAll(@Query() options: FindChangelogsOptionsDto) {
    return this.changelogsService.findAll(options);
  }
}
