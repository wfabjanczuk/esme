import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from './agency.entity';
import { CreateAgencyDto } from './dtos/create-agency.dto';
import { UpdateAgencyDto } from './dtos/update-agency.dto';

@Injectable()
export class AgenciesService {
  constructor(
    @InjectRepository(Agency) private repository: Repository<Agency>,
  ) {}

  async create(props: CreateAgencyDto) {
    const [existingAgency] = await this.repository.find({
      where: [{ name: props.name }],
    });
    if (existingAgency) {
      throw new BadRequestException('Name is already taken');
    }
    const agency = this.repository.create(props);
    return this.repository.save(agency);
  }

  async findOne(id: number) {
    const agency = await this.repository.findOneBy({ id });
    if (!agency) {
      throw new NotFoundException(`Agency with id ${id} not found`);
    }
    return agency;
  }

  findAll() {
    return this.repository.find();
  }

  async update(id: number, props: UpdateAgencyDto) {
    const agency = await this.findOne(id);
    Object.assign(agency, props);
    return this.repository.save(agency);
  }

  async remove(id: number) {
    const agency = await this.findOne(id);
    return this.repository.remove(agency);
  }
}
