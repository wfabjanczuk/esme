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

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async create(props: CreateUserDto) {
    const [existingUser] = await this.repository.find({
      where: [{ email: props.email }, { phoneNumber: props.phoneNumber }],
    });
    if (existingUser) {
      throw new BadRequestException('Email or phone number is already taken');
    }
    const user = this.repository.create(props);
    return this.repository.save(user);
  }

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

  async update(id: number, props: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, props);
    return this.repository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.repository.remove(user);
  }
}
