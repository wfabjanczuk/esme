import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminAgenciesService } from './admin-agencies.service';
import { Agency } from '../agency/agency.entity';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminGuard } from '../../common/guards/admin.guard';
import { VerifyAgencyDto } from './dtos/verify-agency.dto';
import { IdDto } from '../../common/dtos/id.dto';
import { User } from '../users/user.entity';

@Controller('admin/agencies')
@UseGuards(AuthenticationGuard, AdminGuard)
@ApiTags('1. Admin: agencies')
export class AdminAgenciesController {
  constructor(private adminAgenciesService: AdminAgenciesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: [Agency],
  })
  findAll() {
    return this.adminAgenciesService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Agency,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Agency with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param() { id }: IdDto) {
    return this.adminAgenciesService.findOne(id);
  }

  @Patch(':id/verify')
  @ApiResponse({
    status: 200,
    type: Agency,
  })
  @ApiNotFoundResponse({
    schema: {
      example: {
        statusCode: 404,
        message: 'Agency with id 1 not found',
        error: 'Not Found',
      },
    },
  })
  verify(
    @CurrentUser() currentUser: User,
    @Param() { id }: IdDto,
    @Body() body: VerifyAgencyDto,
  ) {
    return this.adminAgenciesService.verify(id, body, currentUser);
  }
}
