import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventAgenciesController } from './event-agencies.controller';
import { EventAgency } from './event-agency.entity';
import { EventAgenciesService } from './event-agencies.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventAgency])],
  controllers: [EventAgenciesController],
  providers: [EventAgenciesService],
})
export class EventAgenciesModule {}
