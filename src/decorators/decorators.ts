import 'reflect-metadata';
import {ColumnTypeName} from '../column';

/** 
 * Borrowing the Type interface from Angular:
 * https://github.com/angular/angular/blob/6.1.6/packages/core/src/type.ts
**/
export interface Type<T> extends Function { new (...args: any[]): T; }

interface DatabaseConfig {
  name: string;
  verison: string;
  entities: Type<any>[];
}

interface EntityConfig {
  name: string;
}

interface ColumnConfig {
  name: string;
  type: ColumnTypeName;
}

export function Entity(config: EntityConfig): ClassDecorator {
  console.log('Entity decorator');
  return Reflect.metadata('entity', config);
}

export function Column(config: ColumnConfig): PropertyDecorator {
  console.log("column decorator", config);
  return Reflect.metadata('column', config);
}

export function getColumn(target: any, propertyKey: string): ColumnConfig {
  return Reflect.getMetadata('column', target, propertyKey);
}

export function Database(config: DatabaseConfig) {
  console.log("DB");
  const entities = config.entities;
  console.log(entities);
  const e = entities[0];
  const meta = Reflect.getMetadata('entity', e);
  const col = Reflect.getMetadata('column', e);
  console.log(meta);
  console.log(col);
  console.log('keys', Reflect.getMetadataKeys(meta));

  // for each entity
  // get table name
  // get columns
  // build table if doesn't exist
  // 
  return (constructor: Function) =>{}
}