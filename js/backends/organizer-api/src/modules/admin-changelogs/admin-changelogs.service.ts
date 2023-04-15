import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Changelog } from '../changelogs/changelog.entity';
import { FindChangelogsOptionsDto } from './dtos/find-changelogs-options.dto';
import { UserRole } from '../users/user-role.enum';

@Injectable()
export class AdminChangelogsService {
  constructor(
    @InjectRepository(Changelog) private repo: Repository<Changelog>,
  ) {}

  findAllAdminChangelogs(options: FindChangelogsOptionsDto) {
    return this.repo
      .createQueryBuilder('c')
      .innerJoin('user', 'u', 'c.userId = u.id')
      .where('u.role IN (:...roles)', {
        roles: [UserRole.superAdmin, UserRole.admin],
        ...options,
      })
      .getMany();
  }

  async findOne(id: number) {
    const changelog = await this.repo.findOneBy({ id });
    if (!changelog) {
      throw new NotFoundException(`Changelog with id ${id} not found`);
    }
    return changelog;
  }
}
