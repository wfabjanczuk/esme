import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from './announcement.entity';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { Event } from '../events/event.entity';
import { AgencyAnnouncementsController } from './agency-announcements.controller';
import { AgencyAnnouncementsService } from './agency-announcements.service';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement, Event])],
  controllers: [AnnouncementsController, AgencyAnnouncementsController],
  providers: [AnnouncementsService, AgencyAnnouncementsService],
})
export class AnnouncementsModule {}
