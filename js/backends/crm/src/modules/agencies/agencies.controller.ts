import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { Agency } from './agency.entity';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminGuard } from '../../common/guards/admin.guard';
import { VerifyAgencyDto } from './dtos/verify-agency.dto';
import { IdDto } from '../../common/dtos/id.dto';
import { UpdateAgencyDto } from './dtos/update-agency.dto';

@Controller('agencies')
@UseGuards(AuthenticationGuard, AdminGuard)
@ApiTags('1. Admin: agencies')
export class AgenciesController {
  constructor(private agenciesService: AgenciesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: [Agency],
  })
  findAll() {
    return this.agenciesService.findAll();
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: Agency,
  })
  update(
    @CurrentUser() currentUser,
    @Param() { id }: IdDto,
    @Body() body: UpdateAgencyDto,
  ) {
    return this.agenciesService.update(id, body, currentUser);
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
    @CurrentUser() currentUser,
    @Param() { id }: IdDto,
    @Body() body: VerifyAgencyDto,
  ) {
    return this.agenciesService.verify(id, body, currentUser);
  }

  @Delete(':id')
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
  async remove(@CurrentUser() currentUser, @Param() { id }: IdDto) {
    return this.agenciesService.remove(id, currentUser);
  }
}