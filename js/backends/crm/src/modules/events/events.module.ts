import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { AgenciesModule } from '../agencies/agencies.module';
import { AgencyEventsController } from './agency-events.controller';
import { AgencyEventsService } from './agency-events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    forwardRef(() => AgenciesModule),
  ],
  controllers: [AgencyEventsController, EventsController],
  providers: [AgencyEventsService, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
