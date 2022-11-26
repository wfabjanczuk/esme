import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventAgency } from './event-agency.entity';
import {
  CreateEventAgencyDto,
  UpdateEventAgencyDto,
  VerifyAgentAgencyDto,
} from './dtos';

@Injectable()
export class EventAgenciesService {
  constructor(
    @InjectRepository(EventAgency)
    private repository: Repository<EventAgency>,
  ) {}

  async create(props: CreateEventAgencyDto) {
    const [existingAgency] = await this.repository.find({
      where: [{ name: props.name }],
    });
    if (existingAgency) {
      throw new BadRequestException(`Name is already taken`);
    }
    const agency = this.repository.create(props);
    return this.repository.save(agency);
  }

  async findOne(id: number) {
    const agency = await this.repository.findOneBy({ id });
    if (!agency) {
      throw new NotFoundException(`Event agency with id ${id} not found`);
    }
    return agency;
  }

  findAll() {
    return this.repository.find();
  }

  async update(id: number, props: UpdateEventAgencyDto) {
    const agency = await this.findOne(id);
    Object.assign(agency, props);
    return this.repository.save(agency);
  }

  async verify(id: number, props: VerifyAgentAgencyDto) {
    const agency = await this.findOne(id);
    Object.assign(agency, props);
    return this.repository.save(agency);
  }

  async remove(id: number) {
    const agency = await this.findOne(id);
    return this.repository.remove(agency);
  }
}
