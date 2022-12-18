import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';
import { CreateContactDto } from './dtos/create-contact.dto';
import { UpdateContactDto } from './dtos/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(Contact) private repo: Repository<Contact>,
  ) {}

  async findOne(id: number) {
    const contact = await this.repo.findOneBy({ id });
    if (!contact) {
      throw new NotFoundException(`Contact with id ${id} not found`);
    }
    return contact;
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

  async create(props: CreateContactDto, event: Event, createdBy: User) {
    const contact = this.repo.create(props);
    contact.event = event;
    return this.lem.create(this.repo, contact, createdBy);
  }

  async update(id: number, props: UpdateContactDto, updatedBy: User) {
    const contact = Object.assign(await this.findOne(id), props);
    return this.lem.update(this.repo, contact, updatedBy);
  }

  async remove(id: number, deletedBy: User) {
    const contact = await this.findOne(id);
    return this.lem.remove(this.repo, contact, deletedBy);
  }
}
