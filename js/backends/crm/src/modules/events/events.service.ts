import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { User } from '../users/user.entity';
import { FindEventsOptionsDto } from './dtos/find-events-options.dto';

@Injectable()
export class EventsService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(Event) private repo: Repository<Event>,
  ) {}

  async findOne(id: number) {
    const event = await this.repo.findOneBy({ id });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }

  findAll(options: FindEventsOptionsDto) {
    return this.repo.find({ where: options });
  }

  async create(props: CreateEventDto, createdBy: User) {
    const [existingEvent] = await this.repo.find({
      where: [{ name: props.name }],
    });
    if (existingEvent) {
      throw new BadRequestException('Name is already taken');
    }
    const event = this.repo.create(props);
    return this.lem.create(this.repo, event, createdBy);
  }

  async update(id: number, props: UpdateEventDto, updatedBy: User) {
    const event = await this.findOne(id);
    Object.assign(event, props);
    return this.lem.update(this.repo, event, updatedBy);
  }

  async remove(id: number, deletedBy: User) {
    const event = await this.findOne(id);
    return this.lem.remove(this.repo, event, deletedBy);
  }
}
