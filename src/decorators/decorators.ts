import 'reflect-metadata';
import {ColumnTypeName} from '../column';
import {ENTITY_MANAGER} from '../entity-manager';

/**
 * Borrowing the Type interface from Angular:
 * https://github.com/angular/angular/blob/6.1.6/packages/core/src/type.ts
 */
export interface Type<T> extends Function {
  new (...args: any[]): T;
}

const METADATA_KEY_ENTITY = 'entity';
const METADATA_KEY_COLUMNS = 'columns';

interface DatabaseConfig {
  name: string;
  version: string;
  entities: Type<any>[];
}

interface EntityConfig {
  /** A unique identifier for this Entity. Defaults to the class name. */
  id?: string;
  name?: string;
}

interface ColumnConfig {
  name: string;
  type: ColumnTypeName;
}

// TODO: Add support for adding constraint-like decorators (PrimaryKey, Unique, etc)

/**
 * An Entity decorator factory. This decorator should be attached to
 * any class that is going to be persisted by the ORM.
 */
export function Entity(config: EntityConfig): ClassDecorator {
  return target => {
    Reflect.defineMetadata(METADATA_KEY_ENTITY, config, target);
  };
}

export function Column(config: ColumnConfig): PropertyDecorator {
  return target => {
    const columns: ColumnConfig[] =
      Reflect.getMetadata(METADATA_KEY_COLUMNS, target.constructor) ?? [];
    columns.push(config);
    Reflect.defineMetadata(METADATA_KEY_COLUMNS, columns, target.constructor);
  };
}

export function getColumns(target: any): ColumnConfig[] {
  return Reflect.getMetadata(METADATA_KEY_COLUMNS, target.constructor);
}

export function getEntity(target: any): ColumnConfig[] {
  return Reflect.getMetadata(METADATA_KEY_ENTITY, target.constructor);
}

export function Database(config: DatabaseConfig): ClassDecorator {
  return (constructor: Function) => {};
}
