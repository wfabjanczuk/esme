import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { AgenciesModule } from '../agencies/agencies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    forwardRef(() => AgenciesModule),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
