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
import { ChangelogsService } from '../changelogs/changelogs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repository: Repository<User>,
    private changelogsService: ChangelogsService,
  ) {}

  findAll() {
    return this.repository.find();
  }

  async findByEmail(email: string) {
    const [user] = await this.repository.find({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findOne(id: number) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(props: CreateUserDto, author?: User) {
    const [existingUser] = await this.repository.find({
      where: [{ email: props.email }, { phoneNumber: props.phoneNumber }],
    });
    if (existingUser) {
      throw new BadRequestException('Email or phone number is already taken');
    }
    let user = this.repository.create(props);
    await this.repository.manager.transaction(async (em) => {
      user = await em.save(user);
      await em.save(this.changelogsService.createInsert(user, author));
    });
    return user;
  }

  async update(id: number, props: UpdateUserDto, author: User) {
    const userBefore = await this.findOne(id);
    const jsonBefore = JSON.stringify(userBefore);
    const userAfter = Object.assign(userBefore, props);
    const changelog = this.changelogsService.createUpdate(
      jsonBefore,
      userAfter,
      author,
    );
    await this.repository.manager.transaction(async (em) => {
      await em.save(userAfter);
      await em.save(changelog);
    });
    return userAfter;
  }

  async remove(id: number, author?: User) {
    const removedUser = await this.findOne(id);
    const changelog = this.changelogsService.createDelete(removedUser, author);
    await this.repository.manager.transaction(async (em) => {
      await em.remove(removedUser);
      await em.save(changelog);
    });
    return Object.assign(removedUser, { id });
  }
}
