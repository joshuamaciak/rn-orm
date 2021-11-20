import 'reflect-metadata';
import {ColumnConstraintType} from '../../constraints/column/column-constraint';
import {Type} from '../decorator-util';

const METADATA_KEY_COLUMN_CONSTRAINTS = 'columnConstraints';

export interface ColumnConstraintConfig {
  type: ColumnConstraintType;
  columnName: string;
  args: any[];
}

export function addConstraintConfigToMetadata(config: ColumnConstraintConfig, target: any): void {
  const constraints: ColumnConstraintConfig[] =
    Reflect.getMetadata(METADATA_KEY_COLUMN_CONSTRAINTS, target.constructor) ?? [];
  constraints.push(config);
  Reflect.defineMetadata(METADATA_KEY_COLUMN_CONSTRAINTS, constraints, target.constructor);
}

export function getColumnConstraintConfigs(target: any): ColumnConstraintConfig[] {
  return Reflect.getMetadata(METADATA_KEY_COLUMN_CONSTRAINTS, target.constructor);
}

export function getColumnConstraintConfigsFromClass(target: Type<any>): ColumnConstraintConfig[] {
  return Reflect.getMetadata(METADATA_KEY_COLUMN_CONSTRAINTS, target);
}
