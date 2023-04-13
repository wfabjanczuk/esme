import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { UserRole } from '../users/user-role.enum';
import { hashSync } from 'bcrypt';
import { UpdateAdminUserDto } from './dtos/update-admin-user.dto';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Injectable()
export class AdminUsersService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findAllAdmins() {
    return this.repo
      .createQueryBuilder('user')
      .where('user.role IN (:...roles)', {
        roles: [UserRole.superAdmin, UserRole.admin],
      })
      .getMany();
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({
      where: { id },
      relations: { agency: true },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(props: CreateUserDto, createdBy: User) {
    const [existingUser] = await this.repo.find({
      where: [{ email: props.email }],
    });
    if (existingUser) {
      throw new BadRequestException('Email is already taken');
    }
    const user = this.repo.create({
      ...props,
      timeCreated: new Date(),
      timeSignOut: new Date(),
    });
    validateRole('create', user, createdBy);

    user.password = hashSync(user.password, 12);
    return this.lem.create(this.repo, user, createdBy);
  }

  async update(id: number, props: UpdateAdminUserDto, updatedBy: User) {
    const user = Object.assign(await this.findOne(id), props);
    validateRole('update', user, updatedBy);
    return this.lem.update(this.repo, user, updatedBy);
  }

  async remove(id: number, deletedBy: User) {
    const user = await this.findOne(id);
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
