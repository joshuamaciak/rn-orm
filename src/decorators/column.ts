import 'reflect-metadata';
import {ColumnType, ColumnTypeName} from '../sql/column';
import {Type} from './decorator-util';

const METADATA_KEY_COLUMNS = 'columns';

export interface ColumnConfig {
  name?: string;
  type?: ColumnType;
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

export function getColumns(target: any): ColumnConfig[] {
  return Reflect.getMetadata(METADATA_KEY_COLUMNS, target.constructor);
}

export function getColumnsFromClass(target: Type<any>): ColumnConfig[] {
  return Reflect.getMetadata(METADATA_KEY_COLUMNS, target);
}

function addColumnConfigToMetadata(config: ColumnConfig, target: any): void {
  const columns: ColumnConfig[] =
    Reflect.getMetadata(METADATA_KEY_COLUMNS, target.constructor) ?? [];
  columns.push(config);
  Reflect.defineMetadata(METADATA_KEY_COLUMNS, columns, target.constructor);
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
