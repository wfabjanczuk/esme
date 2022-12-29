import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { Event } from '../events/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, Event])],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
