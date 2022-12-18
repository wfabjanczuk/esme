import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from './agency.entity';
import { RegisterAgencyDto } from './dtos/register-agency.dto';
import { UpdateAgencyDto } from './dtos/update-agency.dto';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { User, UserRole } from '../users/user.entity';
import { hashSync } from 'bcrypt';
import { VerifyAgencyDto } from './dtos/verify-agency.dto';

@Injectable()
export class AgenciesService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(Agency) private agenciesRepo: Repository<Agency>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async findOne(id: number) {
    const agency = await this.agenciesRepo.findOneBy({ id });
    if (!agency) {
      throw new NotFoundException(`Agency with id ${id} not found`);
    }
    return agency;
  }

  findAll() {
    return this.agenciesRepo.find();
  }

  async register(props: RegisterAgencyDto) {
    const [existingAgency] = await this.agenciesRepo.find({
      where: [{ name: props.agency.name }],
    });
    if (existingAgency) {
      throw new BadRequestException('Agency name is already taken');
    }

    const [existingUser] = await this.usersRepo.find({
      where: [{ email: props.owner.email }],
    });
    if (existingUser) {
      throw new BadRequestException('Owner email is already taken');
    }

    const agency = this.agenciesRepo.create(props.agency);
    const user = this.usersRepo.create(props.owner);
    user.password = hashSync(user.password, 12);
    user.role = UserRole.agencyOwner;

    await this.agenciesRepo.manager.transaction(async (em) => {
      await em.save(agency);
      user.agency = agency;
      await em.save(user);
    });
    return agency;
  }

  async update(id: number, props: UpdateAgencyDto, updatedBy: User) {
    const agency = Object.assign(await this.findOne(id), props);
    return this.lem.update(this.agenciesRepo, agency, updatedBy);
  }

  async verify(id: number, props: VerifyAgencyDto, updatedBy: User) {
    const agency = Object.assign(await this.findOne(id), props);
    return this.lem.update(this.agenciesRepo, agency, updatedBy);
  }

  async remove(id: number, deletedBy: User) {
    const agency = await this.findOne(id);
    return this.lem.remove(this.agenciesRepo, agency, deletedBy);
  }
}
