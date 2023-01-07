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

  async logInsert(em: EntityManager, entity: LoggableEntity, createdBy: User) {
    await em.save(
      this.repo.create({
        entityId: entity.id,
        entityClass: entity.constructor.name,
        type: ChangeType.insert,
        changedAt: new Date(),
        valueAfter: JSON.stringify(entity),
        userId: createdBy.id,
        agencyId: createdBy.agencyId,
      }),
    );
  }

  async logUpdate(em: EntityManager, entity: LoggableEntity, updatedBy: User) {
    await em.save(
      this.repo.create({
        entityId: entity.id,
        entityClass: entity.constructor.name,
        type: ChangeType.update,
        changedAt: new Date(),
        valueAfter: JSON.stringify(entity),
        userId: updatedBy.id,
        agencyId: updatedBy.agencyId,
      }),
    );
  }

  async logDelete(em: EntityManager, entity: LoggableEntity, deletedBy: User) {
    await em.save(
      this.repo.create({
        entityId: entity.id,
        entityClass: entity.constructor.name,
        type: ChangeType.delete,
        changedAt: new Date(),
        valueAfter: undefined,
        userId: deletedBy.id,
        agencyId: deletedBy.agencyId,
      }),
    );
  }
}
