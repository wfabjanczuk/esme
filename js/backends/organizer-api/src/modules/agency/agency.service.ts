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
    const user = this.usersRepo.create({
      ...props.owner,
      password: hashSync(props.owner.password, 12),
      role: UserRole.agencyOwner,
      timeCreated: new Date(),
      timeSignOut: new Date(),
    });

    await this.agenciesRepo.manager.transaction(async (em) => {
      await em.save(agency);
      user.agencyId = agency.id;
      await em.save(user);
      await this.lem.logInsert(em, agency, user);
    });
    return agency;
  }

  async update(props: UpdateAgencyDto, updatedBy: User) {
    const agency = Object.assign(updatedBy.agency, props);
    return this.lem.update(this.agenciesRepo, agency, updatedBy);
  }

  async remove(deletedBy: User) {
    await this.usersRepo
      .createQueryBuilder()
      .delete()
      .where(
        '"user".role NOT IN (:...roles) AND "user"."agencyId" = :agencyId',
        {
          roles: [UserRole.superAdmin, UserRole.admin],
          agencyId: deletedBy.agency.id,
        },
      )
      .execute();

    const { id } = deletedBy.agency;
    await this.agenciesRepo.remove(deletedBy.agency);
    return Object.assign(deletedBy.agency, { id });
  }
}
