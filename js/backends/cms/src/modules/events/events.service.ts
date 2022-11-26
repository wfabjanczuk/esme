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
import { Agency } from '../agencies/agency.entity';

@Injectable()
export class EventsService {
  constructor(@InjectRepository(Event) private repository: Repository<Event>) {}

  async create(props: CreateEventDto, agency: Agency) {
    const [existingEvent] = await this.repository.find({
      where: [{ name: props.name }],
    });
    if (existingEvent) {
      throw new BadRequestException('Name is already taken');
    }
    const event = this.repository.create(props);
    event.agency = agency;
    return this.repository.save(event);
  }

  async findOne(id: number) {
    const event = await this.repository.findOneBy({ id });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }

  findAll(agencyId?: string) {
    if (!agencyId) {
      return this.repository.find();
    }
    return this.repository.find({
      where: {
        agency: {
          id: parseInt(agencyId),
        },
      },
    });
  }

  countAll(agencyId?: string) {
    if (!agencyId) {
      return this.repository.count();
    }
    return this.repository.count({
      where: {
        agency: {
          id: parseInt(agencyId),
        },
      },
    });
  }

  async update(id: number, props: UpdateEventDto) {
    const event = await this.findOne(id);
    Object.assign(event, props);
    return this.repository.save(event);
  }

  async remove(id: number) {
    const event = await this.findOne(id);
    return this.repository.remove(event);
  }
}
