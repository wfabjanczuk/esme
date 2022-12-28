import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { hashSync } from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  update(props: UpdateUserDto, currentUser: User) {
    const user = Object.assign(currentUser, props);
    return this.lem.update(this.repo, user, currentUser);
  }

  changePassword(props: ChangePasswordDto, currentUser: User) {
    currentUser.password = hashSync(props.password, 12);
    return this.lem.update(this.repo, currentUser, currentUser);
  }
}
