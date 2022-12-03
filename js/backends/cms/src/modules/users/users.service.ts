import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';

@Injectable()
export class UsersService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findByEmail(email: string) {
    const [user] = await this.repo.find({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(props: CreateUserDto, createdBy?: User) {
    const [existingUser] = await this.repo.find({
      where: [{ email: props.email }, { phoneNumber: props.phoneNumber }],
    });
    if (existingUser) {
      throw new BadRequestException('Email or phone number is already taken');
    }
    const user = this.repo.create(props);
    return this.lem.create(this.repo, user, createdBy);
  }

  async update(id: number, props: UpdateUserDto, updatedBy?: User) {
    const user = Object.assign(await this.findOne(id), props);
    return this.lem.update(this.repo, user, updatedBy);
  }

  async remove(id: number, deletedBy?: User) {
    const user = await this.findOne(id);
    return this.lem.remove(this.repo, user, deletedBy);
  }
}
