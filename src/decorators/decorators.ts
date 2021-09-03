import 'reflect-metadata';
import {ColumnType, ColumnTypeName} from '../column';
import {ColumnConstraintType, TableConstraintType} from '../constraints';
import {ENTITY_MANAGER} from '../entity-manager';

/**
 * Borrowing the Type interface from Angular:
 * https://github.com/angular/angular/blob/6.1.6/packages/core/src/type.ts
 */
export interface Type<T> extends Function {
  new (...args: any[]): T;
}

const METADATA_KEY_DATABASE = 'database';
const METADATA_KEY_ENTITY = 'entity';
const METADATA_KEY_COLUMNS = 'columns';
const METADATA_KEY_CONSTRAINTS = 'constraints';

interface DatabaseConfig {
  name: string;
  version: string;
  entities: Type<any>[];
}

export interface EntityConfig {
  name?: string;
}

export interface ColumnConfig {
  name?: string;
  type?: ColumnType;
}

interface ConstraintConfig {
  type: ColumnConstraintType | TableConstraintType;
  columnName: string;
  args: any[];
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

export function Column(config?: ColumnConfig): PropertyDecorator {
  return (target, propertyKey) => {
    const columnConfig = config ?? {};
    if (!columnConfig.name) {
      columnConfig.name = propertyKey.toString();
    }
    if (!columnConfig.type) {
      const propertyType = Reflect.getMetadata('design:type', target, propertyKey);
      columnConfig.type = inferColumnType(propertyType.name);
    }

    addColumnConfigToMetadata(columnConfig, target);
  };
}

export function PrimaryKey(): PropertyDecorator {
  return (target, propertyKey) => {
    const config = {
      type: ColumnConstraintType.PRIMARY_KEY,
      columnName: propertyKey.toString(),
      args: [],
    };
    addConstraintConfigToMetadata(config, target);
  };
}

export function NotNull(): PropertyDecorator {
  return (target, propertyKey) => {
    const config = {
      type: ColumnConstraintType.NOT_NULL,
      columnName: propertyKey.toString(),
      args: [],
    };
    addConstraintConfigToMetadata(config, target);
  };
}

export function Unique(): PropertyDecorator {
  return (target, propertyKey) => {
    const config = {
      type: ColumnConstraintType.UNIQUE,
      columnName: propertyKey.toString(),
      args: [],
    };
    addConstraintConfigToMetadata(config, target);
  };
}

export function Default(expression: string): PropertyDecorator {
  return (target, propertyKey) => {
    const config = {
      type: ColumnConstraintType.DEFAULT,
      columnName: propertyKey.toString(),
      args: [expression],
    };
    addConstraintConfigToMetadata(config, target);
  };
}

function addConstraintConfigToMetadata(config: ConstraintConfig, target: any): void {
  const constraints: ConstraintConfig[] =
    Reflect.getMetadata(METADATA_KEY_CONSTRAINTS, target.constructor) ?? [];
  constraints.push(config);
  Reflect.defineMetadata(METADATA_KEY_CONSTRAINTS, constraints, target.constructor);
}

function addColumnConfigToMetadata(config: ColumnConfig, target: any): void {
  const columns: ColumnConfig[] =
    Reflect.getMetadata(METADATA_KEY_COLUMNS, target.constructor) ?? [];
  columns.push(config);
  Reflect.defineMetadata(METADATA_KEY_COLUMNS, columns, target.constructor);
}

export function getConstraintConfigs(target: any): ConstraintConfig[] {
  return Reflect.getMetadata(METADATA_KEY_CONSTRAINTS, target.constructor);
}

export function getConstraintConfigsFromClass(target: Type<any>): ConstraintConfig[] {
  return Reflect.getMetadata(METADATA_KEY_CONSTRAINTS, target);
}

export function getColumns(target: any): ColumnConfig[] {
  return Reflect.getMetadata(METADATA_KEY_COLUMNS, target.constructor);
}

export function getColumnsFromClass(target: Type<any>): ColumnConfig[] {
  return Reflect.getMetadata(METADATA_KEY_COLUMNS, target);
}

export function getEntityConfig(target: any): EntityConfig {
  return Reflect.getMetadata(METADATA_KEY_ENTITY, target.constructor);
}

export function getEntityConfigFromClass(target: Type<any>): EntityConfig {
  return Reflect.getMetadata(METADATA_KEY_ENTITY, target);
}

export function getDatabaseConfig(target: any): DatabaseConfig {
  return Reflect.getMetadata(METADATA_KEY_DATABASE, target.constructor);
}

export function Database(config: DatabaseConfig): ClassDecorator {
  return target => {
    Reflect.defineMetadata(METADATA_KEY_DATABASE, config, target);
  };
}

/** Tries to infer a ColumnType from the provided type. */
function inferColumnType(type: string): ColumnType {
  switch (type) {
    case Number.name:
      return {name: ColumnTypeName.INTEGER, args: []};
    case String.name:
      return {name: ColumnTypeName.TEXT, args: []};
    case Boolean.name:
      return {name: ColumnTypeName.BOOLEAN, args: []};
    default:
      throw new Error(`Unable to infer ColumnType from provided type ${type}`);
  }
}