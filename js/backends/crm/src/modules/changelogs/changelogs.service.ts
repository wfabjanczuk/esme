import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Changelog } from './changelog.entity';

@Injectable()
export class ChangelogsService {
  constructor(
    @InjectRepository(Changelog) private repo: Repository<Changelog>,
  ) {}

  findAll() {
    return this.repo.find();
  }
}
