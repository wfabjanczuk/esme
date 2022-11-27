import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Changelog, ChangeType } from './changelog.entity';
import { User } from '../users/user.entity';

interface Entity {
  id: number;
  constructor: {
    name: string;
  };
}

@Injectable()
export class ChangelogsService {
  constructor(
    @InjectRepository(Changelog) private repository: Repository<Changelog>,
  ) {}

  createInsert(entity: Entity, author?: User) {
    return this.repository.create({
      entityId: entity.id,
      entityClass: entity.constructor.name,
      type: ChangeType.insert,
      time: new Date().toISOString(),
      before: undefined,
      after: JSON.stringify(entity),
      author: author,
    });
  }

  createUpdate(jsonBefore: string, entityAfter: Entity, author?: User) {
    return this.repository.create({
      entityId: entityAfter.id,
      entityClass: entityAfter.constructor.name,
      type: ChangeType.update,
      time: new Date().toISOString(),
      before: jsonBefore,
      after: JSON.stringify(entityAfter),
      author: author,
    });
  }

  createDelete(entity: Entity, author?: User) {
    return this.repository.create({
      entityId: entity.id,
      entityClass: entity.constructor.name,
      type: ChangeType.delete,
      time: new Date().toISOString(),
      before: JSON.stringify(entity),
      after: undefined,
      author: author,
    });
  }
}
