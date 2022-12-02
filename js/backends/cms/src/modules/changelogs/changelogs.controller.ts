import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { Changelog } from './changelog.entity';
import { ChangelogsService } from './changelogs.service';

@Controller('changelogs')
@ApiTags('Changelogs')
@UseGuards(AuthGuard)
export class ChangelogsController {
  constructor(private changelogsService: ChangelogsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: [Changelog],
  })
  findAllAgencies() {
    return this.changelogsService.findAll();
  }
}
