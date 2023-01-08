import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgenciesController } from './agencies.controller';
import { Agency } from './agency.entity';
import { AgenciesService } from './agencies.service';
import { User } from '../users/user.entity';
import { AgencyController } from './agency.controller';
import { AgencyService } from './agency.service';

@Module({
  imports: [TypeOrmModule.forFeature([Agency, User])],
  controllers: [AgencyController, AgenciesController],
  providers: [AgenciesService, AgencyService],
  exports: [AgenciesService],
})
export class AgenciesModule {}
