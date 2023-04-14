import { Module } from '@nestjs/common';
import { ApiEventsController } from './api-events.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { ApiEventsService } from './api-events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../events/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), AuthenticationModule],
  controllers: [ApiEventsController],
  providers: [ApiEventsService],
})
export class ApiEventsModule {}
