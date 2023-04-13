import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { hashSync } from 'bcrypt';
import { SetAgencyDto } from './dtos/set-agency.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private lem: LoggingEntityManager,
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  update(props: UpdateProfileDto, currentUser: User) {
    const user = Object.assign(currentUser, props);
    return this.lem.update(this.repo, user, currentUser);
  }

  changePassword(props: ChangePasswordDto, currentUser: User) {
    currentUser.password = hashSync(props.newPassword, 12);
    currentUser.timeSignOut = new Date();
    return this.lem.update(this.repo, currentUser, currentUser);
  }

  setAgency(props: SetAgencyDto, currentUser: User) {
    if (!props.agencyId) {
      currentUser.agencyId = null;
      currentUser.agency = null;
    }
    const user = Object.assign(currentUser, props);
    return this.lem.update(this.repo, user, currentUser);
  }
}
