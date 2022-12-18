import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcement.entity';
import { User } from '../users/user.entity';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { CreateAnnouncementDto } from './dtos/create-announcement.dto';
import { Event } from '../events/event.entity';
import { UpdateAnnouncementDto } from './dtos/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(Announcement) private repo: Repository<Announcement>,
  ) {}

  async findOne(id: number) {
    const announcement = await this.repo.findOneBy({ id });
    if (!announcement) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }
    return announcement;
  }

  findAll(event?: Event) {
    if (!event) {
      return this.repo.find();
    }
    return this.repo.find({
      where: {
        event: {
          id: event.id,
        },
      },
    });
  }

  async create(props: CreateAnnouncementDto, event: Event, createdBy: User) {
    const announcement = this.repo.create(props);
    announcement.event = event;
    announcement.timeSent = new Date();
    return this.lem.create(this.repo, announcement, createdBy);
  }

  async update(id: number, props: UpdateAnnouncementDto, updatedBy: User) {
    const announcement = Object.assign(await this.findOne(id), props);
    return this.lem.update(this.repo, announcement, updatedBy);
  }

  async remove(id: number, deletedBy: User) {
    const announcement = await this.findOne(id);
    return this.lem.remove(this.repo, announcement, deletedBy);
  }
}
