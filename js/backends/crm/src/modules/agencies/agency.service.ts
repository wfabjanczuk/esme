import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterAgencyDto } from './dtos/register-agency.dto';
import { hashSync } from 'bcrypt';
import { User } from '../users/user.entity';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Agency } from './agency.entity';
import { Repository } from 'typeorm';
import { UpdateAgencyDto } from './dtos/update-agency.dto';
import { UserRole } from '../users/user-role.enum';

@Injectable()
export class AgencyService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(Agency) private agenciesRepo: Repository<Agency>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

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

  async update(props: UpdateAgencyDto, updatedBy: User) {
    const agency = Object.assign(updatedBy.agency, props);
    return this.lem.update(this.agenciesRepo, agency, updatedBy);
  }

  async remove(deletedBy: User) {
    const { id } = deletedBy.agency;
    await this.agenciesRepo.remove(deletedBy.agency);
    return Object.assign(deletedBy.agency, { id });
  }
}
