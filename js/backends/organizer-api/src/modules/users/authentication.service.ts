import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { User } from './user.entity';
import { compareSync, hashSync } from 'bcrypt';
import { LoggingEntityManager } from '../changelogs/logging-entity-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserRole } from './user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, OrganizerTokenPrefix } from './jwt.config';
import { AuthenticatedUserDto } from './dtos/authenticated-user.dto';

export const signInErrorMessage = 'invalid email or password';
export const agencyInactiveErrorMessage =
  'your agency is not approved by administrators';

@Injectable()
export class AuthenticationService implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private lem: LoggingEntityManager,
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  async authenticate(email: string, password: string) {
    const [user] = await this.repo.find({
      where: { email },
      relations: { agency: true },
    });
    if (!user) {
      throw new BadRequestException(signInErrorMessage);
    }
    if (!compareSync(password, user.password)) {
      throw new BadRequestException(signInErrorMessage);
    }
    if (user.agency && !user.agency.approved) {
      throw new BadRequestException(agencyInactiveErrorMessage);
    }

    const authenticatedUser: AuthenticatedUserDto = {
      user,
      token: this.generateToken(user.id),
    };
    return authenticatedUser;
  }

  async signOut(user: User) {
    user.timeSignOut = new Date();
    return await this.lem.update(this.repo, user, user);
  }

  generateToken(userId: number) {
    const payload: Partial<JwtPayload> = { sub: userId };
    const jwt = this.jwtService.sign(payload);
    return `${OrganizerTokenPrefix}:${jwt}`;
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
      timeCreated: new Date(),
      timeSignOut: new Date(),
      role: UserRole.superAdmin,
    });
    await this.repo.save(superAdmin);
  }
}
