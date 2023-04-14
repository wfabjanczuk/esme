import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../events/event.entity';
import { Repository } from 'typeorm';
import { FindEventsDto } from './dtos/find-events.dto';

@Injectable()
export class ApiEventsService {
  constructor(@InjectRepository(Event) private repo: Repository<Event>) {}

  findEvents(options: FindEventsDto) {
    const qb = this.repo
      .createQueryBuilder('e')
      .innerJoin('e.agency', 'a')
      .where('a.approved = true');

    if (options.query) {
      options.query = options.query.replaceAll('%', '\\%');
      qb.andWhere(
        '(e.name ILIKE :query OR e.description ILIKE :query OR e.address ILIKE :query)',
        {
          query: `%${options.query}%`,
        },
      );
    }

    if (options.from) {
      qb.andWhere('e."timeStart" >= :from', {
        from: `%${options.from}%`,
      });
    }

    if (options.to) {
      qb.andWhere('e."timeStart" <= :to', {
        to: `%${options.to}%`,
      });
    }

    return qb.getMany();
  }

  async findOne(id: number) {
    const event = await this.repo
      .createQueryBuilder('e')
      .innerJoin('e.agency', 'a')
      .where('a.approved = true and e.id = :id', { id: id })
      .getOne();

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }
}
