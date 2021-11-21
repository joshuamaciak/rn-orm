import 'reflect-metadata';

import {Type} from './decorator-util';

const METADATA_KEY_ENTITY = 'entity';

/**
 * An Entity decorator factory. This decorator should be attached to
 * any class that is going to be persisted by the ORM.
 */
export function Entity(config: EntityConfig): ClassDecorator {
  return target => {
    Reflect.defineMetadata(METADATA_KEY_ENTITY, config, target);
  };
}

/**
 * EntityConfig is where you define info about the Entity/Table mapping. This is
 * also where table constraints are defined.
 */
export interface EntityConfig {
  name?: string;
  primaryKeys?: string[];
  foreignKeys?: ForeignKeyConfig[];
}

/**
 * A ForeignKeyConfig is used to define FOREIGN KEY table constraints. If you are
 * not defining a composite foreign key, you can also use the @ForeignKey property
 * decorator.
 */
export interface ForeignKeyConfig {
  /** The columns that this constraint is applied to. */
  columnNames: string[];
  /** The foreign Entity that this key is referencing. */
  foreignEntity: Type<any>;
  /** The columns on the foreign Entity that this key is referencing. */
  foreignColumnNames: string[];
}

export function getEntityConfig(target: any): EntityConfig {
  return Reflect.getMetadata(METADATA_KEY_ENTITY, target.constructor);
}

export function getEntityConfigFromClass(target: Type<any>): EntityConfig {
  return Reflect.getMetadata(METADATA_KEY_ENTITY, target);
}
