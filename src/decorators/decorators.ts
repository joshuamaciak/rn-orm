import 'reflect-metadata';
import {ColumnTypeName} from '../column';
import {ENTITY_MANAGER} from '../entity-manager';

/**
 * Borrowing the Type interface from Angular:
 * https://github.com/angular/angular/blob/6.1.6/packages/core/src/type.ts
 **/
export interface Type<T> extends Function {
  new (...args: any[]): T;
}

const METADATA_KEY_ENTITY = 'entity';
const METADATA_KEY_COLUMNS = 'columns';

interface DatabaseConfig {
  name: string;
  verison: string;
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

export function Entity(config: EntityConfig): ClassDecorator {
  console.log('Entity decorator');
  return target => {
    Reflect.defineMetadata(METADATA_KEY_ENTITY, config, target);
    const columns = Reflect.getMetadata(METADATA_KEY_COLUMNS, target);
    console.log('entity constructor', columns);
  };
}

export function Column(config: ColumnConfig): PropertyDecorator {
  console.log('column decorator', config);
  return target => {
    const columns: ColumnConfig[] =
      Reflect.getMetadata(METADATA_KEY_COLUMNS, target.constructor) ?? [];
    columns.push(config);
    Reflect.defineMetadata('columns', columns, target.constructor);
  };
}

export function getColumn(target: any, propertyKey: string): ColumnConfig {
  return Reflect.getMetadata('column', target, propertyKey);
}

export function Database(config: DatabaseConfig) {
  const entities = config.entities;
  console.log(entities);
  const e = entities[0];
  const meta = Reflect.getMetadata(METADATA_KEY_ENTITY, e);
  const col = Reflect.getMetadata(METADATA_KEY_COLUMNS, e);
  console.log(meta);
  console.log(col);
  // console.log('keys', Reflect.getMetadataKeys(meta));

  // for each entity
  // get table name
  // get columns
  // build table if doesn't exist
  //
  return (constructor: Function) => {};
}
