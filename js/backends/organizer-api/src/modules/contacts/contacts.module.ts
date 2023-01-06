import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { Event } from '../events/event.entity';
import { AgencyContactsService } from './agency-contacts.service';
import { AgencyContactsController } from './agency-contacts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, Event])],
  controllers: [ContactsController, AgencyContactsController],
  providers: [ContactsService, AgencyContactsService],
})
export class ContactsModule {}
