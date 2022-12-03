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
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { User } from '../users/user.entity';

@Injectable()
export class AgenciesService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(Agency) private repo: Repository<Agency>,
  ) {}

  async findOne(id: number) {
    const agency = await this.repo.findOneBy({ id });
    if (!agency) {
      throw new NotFoundException(`Agency with id ${id} not found`);
    }
    return agency;
  }

  findAll() {
    return this.repo.find();
  }

  async create(props: CreateAgencyDto, createdBy?: User) {
    const [existingAgency] = await this.repo.find({
      where: [{ name: props.name }],
    });
    if (existingAgency) {
      throw new BadRequestException('Name is already taken');
    }
    const agency = this.repo.create(props);
    return this.lem.create(this.repo, agency, createdBy);
  }

  async update(id: number, props: UpdateAgencyDto, updatedBy?: User) {
    const agency = Object.assign(await this.findOne(id), props);
    return this.lem.update(this.repo, agency, updatedBy);
  }

  async remove(id: number, deletedBy?: User) {
    const agency = await this.findOne(id);
    return this.lem.remove(this.repo, agency, deletedBy);
  }
}
