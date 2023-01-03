import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { hashSync } from 'bcrypt';
import { CreateAgencyUserDto } from './dtos/create-agency-user.dto';

@Injectable()
export class AgencyUsersService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  findAll(agencyId: number) {
    return this.repo.find({ where: { agencyId } });
  }

  async findOne(id: number, agencyId: number) {
    const user = await this.repo.findOne({
      where: { id, agencyId },
      relations: { agency: true },
    });
    if (!user) {
      throw new NotFoundException(
        `User with id ${id} not found in agency ${agencyId}`,
      );
    }
    return user;
  }

  async create(props: CreateAgencyUserDto, createdBy: User) {
    const [existingUser] = await this.repo.find({
      where: [{ email: props.email }],
    });
    if (existingUser) {
      throw new BadRequestException('Email is already taken');
    }
    const user = this.repo.create(props);
    validateRole('create', user, createdBy);

    user.agencyId = createdBy.agencyId;
    user.password = hashSync(user.password, 12);
    return this.lem.create(this.repo, user, createdBy);
  }

  async update(id: number, props: UpdateUserDto, updatedBy: User) {
    const user = Object.assign(
      await this.findOne(id, updatedBy.agencyId),
      props,
    );
    validateRole('update', user, updatedBy);
    return this.lem.update(this.repo, user, updatedBy);
  }

  async remove(id: number, deletedBy: User) {
    const user = await this.findOne(id, deletedBy.agencyId);
    validateRole('delete', user, deletedBy);
    return this.lem.remove(this.repo, user, deletedBy);
  }
}

const validateRole = (action: string, user: User, changedBy: User) => {
  if (user.role <= changedBy.role) {
    throw new ForbiddenException(
      `Not allowed to ${action} user with same role or senior`,
    );
  }
};
