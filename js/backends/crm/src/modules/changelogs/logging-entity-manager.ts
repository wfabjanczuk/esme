import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Changelog, ChangeType } from './changelog.entity';
import { User } from '../users/user.entity';

interface LoggableEntity {
  id: number;
  constructor: {
    name: string;
  };
}

@Injectable()
export class LoggingEntityManager {
  constructor(
    @InjectRepository(Changelog) private repo: Repository<Changelog>,
  ) {}

  async create<T extends LoggableEntity>(
    repo: Repository<T>,
    entity: T,
    createdBy: User,
  ) {
    await repo.manager.transaction(async (em) => {
      entity = await em.save(entity);
      await this.logInsert(em, entity, createdBy);
    });
    return entity;
  }

  async update<T extends LoggableEntity>(
    repo: Repository<T>,
    entity: T,
    updatedBy: User,
  ) {
    await repo.manager.transaction(async (em) => {
      entity = await em.save(entity);
      await this.logUpdate(em, entity, updatedBy);
    });
    return entity;
  }

  async remove<T extends LoggableEntity>(
    repo: Repository<T>,
    entity: T,
    deletedBy: User,
  ) {
    const { id } = entity;
    await repo.manager.transaction(async (em) => {
      entity = await em.remove(entity);
      Object.assign(entity, { id });
      await this.logDelete(em, entity, deletedBy);
    });
    return entity;
  }

  private async logInsert(
    em: EntityManager,
    entity: LoggableEntity,
    createdBy: User,
  ) {
    await em.save(
      this.repo.create({
        entityId: entity.id,
        entityClass: entity.constructor.name,
        type: ChangeType.insert,
        time: new Date().toISOString(),
        after: JSON.stringify(entity),
        author: createdBy,
        agencyId: createdBy.agencyId,
      }),
    );
  }

  private async logUpdate(
    em: EntityManager,
    entity: LoggableEntity,
    updatedBy: User,
  ) {
    await em.save(
      this.repo.create({
        entityId: entity.id,
        entityClass: entity.constructor.name,
        type: ChangeType.update,
        time: new Date().toISOString(),
        after: JSON.stringify(entity),
        author: updatedBy,
        agencyId: updatedBy.agencyId,
      }),
    );
  }

  private async logDelete(
    em: EntityManager,
    entity: LoggableEntity,
    deletedBy: User,
  ) {
    await em.save(
      this.repo.create({
        entityId: entity.id,
        entityClass: entity.constructor.name,
        type: ChangeType.delete,
        time: new Date().toISOString(),
        after: undefined,
        author: deletedBy,
        agencyId: deletedBy.agencyId,
      }),
    );
  }
}
