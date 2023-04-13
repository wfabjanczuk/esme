import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from '../agency/agency.entity';
import { UpdateAgencyDto } from '../agency/dtos/update-agency.dto';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { User } from '../users/user.entity';
import { VerifyAgencyDto } from './dtos/verify-agency.dto';

@Injectable()
export class AdminAgenciesService {
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

  async update(id: number, props: UpdateAgencyDto, updatedBy: User) {
    const agency = Object.assign(await this.findOne(id), props);
    return this.lem.update(this.repo, agency, updatedBy);
  }

  async verify(id: number, props: VerifyAgencyDto, updatedBy: User) {
    const agency = Object.assign(await this.findOne(id), props);
    return this.lem.update(this.repo, agency, updatedBy);
  }

  async remove(id: number, deletedBy: User) {
    const agency = await this.findOne(id);
    return this.lem.remove(this.repo, agency, deletedBy);
  }
}
