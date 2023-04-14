import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAgenciesController } from './admin-agencies.controller';
import { AdminAgenciesService } from './admin-agencies.service';
import { User } from '../users/user.entity';
import { Agency } from '../agency/agency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agency, User])],
  controllers: [AdminAgenciesController],
  providers: [AdminAgenciesService],
})
export class AdminAgenciesModule {}
