import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Changelog } from './changelog.entity';
import { FindChangelogsOptionsDto } from './dtos/find-changelogs-options.dto';

@Injectable()
export class ChangelogsService {
  constructor(
    @InjectRepository(Changelog) private repo: Repository<Changelog>,
  ) {}

  findAll(options: FindChangelogsOptionsDto) {
    return this.repo.find({ where: options });
  }
}
