import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
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

  async update(id: number, props: UpdateUserDto, updatedBy: User) {
    const user = Object.assign(await this.findOne(id), props);
    return this.lem.update(this.repo, user, updatedBy);
  }

  async remove(id: number, deletedBy: User) {
    const user = await this.findOne(id);
    return this.lem.remove(this.repo, user, deletedBy);
  }
}
