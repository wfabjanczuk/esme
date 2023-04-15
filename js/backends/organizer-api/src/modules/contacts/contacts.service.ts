import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { User } from '../users/user.entity';
import { CreateContactDto } from './dtos/create-contact.dto';
import { UpdateContactDto } from './dtos/update-contact.dto';
import { FindContactsOptionsDto } from './dtos/find-contacts-options.dto';
import { Event } from '../events/event.entity';

@Injectable()
export class ContactsService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(Contact) private contactsRepo: Repository<Contact>,
    @InjectRepository(Event) private eventsRepo: Repository<Event>,
  ) {}

  async findOne(id: number, agencyId: number) {
    const contact = await this.contactsRepo.findOneBy({ id, agencyId });
    if (!contact) {
      throw new NotFoundException(`Contact with id ${id} not found`);
    }
    return contact;
  }

  findAll(options: FindContactsOptionsDto) {
    return this.contactsRepo.find({ where: options });
  }

  async create(props: CreateContactDto, createdBy: User) {
    const event = await this.eventsRepo.findOneBy({
      id: props.eventId,
      agencyId: createdBy.agencyId,
    });
    if (!event) {
      throw new NotFoundException(
        `Event with id ${props.eventId} not found in agency ${createdBy.agencyId}`,
      );
    }

    const contact = this.contactsRepo.create(props);
    contact.agencyId = createdBy.agencyId;
    return this.lem.create(this.contactsRepo, contact, createdBy);
  }

  async update(id: number, props: UpdateContactDto, updatedBy: User) {
    const contact = Object.assign(
      await this.findOne(id, updatedBy.agencyId),
      props,
    );
    return this.lem.update(this.contactsRepo, contact, updatedBy);
  }

  async remove(id: number, deletedBy: User) {
    const contact = await this.findOne(id, deletedBy.agencyId);
    return this.lem.remove(this.contactsRepo, contact, deletedBy);
  }
}
