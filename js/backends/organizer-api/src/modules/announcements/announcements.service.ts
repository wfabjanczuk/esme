import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcement.entity';
import { User } from '../users/user.entity';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { CreateAnnouncementDto } from './dtos/create-announcement.dto';
import { UpdateAnnouncementDto } from './dtos/update-announcement.dto';
import { Event } from '../events/event.entity';
import { FindAnnouncementsOptionsDto } from './dtos/find-announcements-options.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(Announcement)
    private announcementsRepo: Repository<Announcement>,
    @InjectRepository(Event) private eventsRepo: Repository<Event>,
  ) {}

  async findOne(id: number) {
    const announcement = await this.announcementsRepo.findOneBy({ id });
    if (!announcement) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }
    return announcement;
  }

  findAll(options: FindAnnouncementsOptionsDto) {
    return this.announcementsRepo.find({ where: options });
  }

  async create(props: CreateAnnouncementDto, createdBy: User) {
    const event = await this.eventsRepo.findOneBy({ id: props.eventId });
    if (!event) {
      throw new NotFoundException(`Event with id ${props.eventId} not found`);
    }

    const announcement = this.announcementsRepo.create(props);
    announcement.agencyId = event.agencyId;
    announcement.timeSent = new Date();
    return this.lem.create(this.announcementsRepo, announcement, createdBy);
  }

  async update(id: number, props: UpdateAnnouncementDto, updatedBy: User) {
    const announcement = Object.assign(await this.findOne(id), props);
    return this.lem.update(this.announcementsRepo, announcement, updatedBy);
  }

  async remove(id: number, deletedBy: User) {
    const announcement = await this.findOne(id);
    return this.lem.remove(this.announcementsRepo, announcement, deletedBy);
  }
}
