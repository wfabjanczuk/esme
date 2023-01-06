import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { User } from './user.entity';
import { compareSync, hashSync } from 'bcrypt';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserRole } from './user-role.enum';

@Injectable()
export class AuthenticationService implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private lem: LoggingEntityManager,
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  async authenticate(email: string, password: string) {
    const errorMessage = 'Invalid email or password';
    const [user] = await this.repo.find({ where: { email } });
    if (!user) {
      throw new BadRequestException(errorMessage);
    }
    if (!compareSync(password, user.password)) {
      throw new BadRequestException(errorMessage);
    }
    return user;
  }

  async onModuleInit() {
    const existingSuperAdmin = await this.repo.findOne({
      where: {
        role: UserRole.superAdmin,
      },
    });
    if (existingSuperAdmin) {
      return;
    }
    await this.registerSuperAdmin();
  }

  async registerSuperAdmin() {
    const superAdmin = this.repo.create({
      email: this.configService.get('SUPER_ADMIN_EMAIL'),
      password: hashSync(this.configService.get('SUPER_ADMIN_PASSWORD'), 12),
      firstName: 'Super',
      lastName: 'Admin',
      phoneNumber: '+48123456789',
      role: UserRole.superAdmin,
    });
    await this.repo.save(superAdmin);
  }
}
