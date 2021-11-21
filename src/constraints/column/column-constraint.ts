import {Constraint} from '../constraint';
import {convertDefaultColumnConstraintToSql, DefaultColumnConstraint, ValueType} from './default';
import {convertNotNullColumnConstraintToSql, NotNullColumnConstraint} from './not-null';
import {
  convertPrimaryKeyColumnConstraintToSql,
  Ordering,
  PrimaryKeyColumnConstraint,
} from './primary-key';
import {convertUniqueColumnConstraintToSql, UniqueColumnConstraint} from './unique';

export interface ColumnConstraint extends Constraint {
  type: ColumnConstraintType;
  columnName: string;
}

/** A collection of possible column constraints in SQL. */
export enum ColumnConstraintType {
  PRIMARY_KEY = 'PRIMARY KEY',
  NOT_NULL = 'NOT NULL',
  UNIQUE = 'UNIQUE',
  CHECK = 'CHECK',
  DEFAULT = 'DEFAULT',
  COLLATE = 'COLLATE',
  FOREIGN_KEY = 'FOREIGN KEY',
}

export class ColumnConstraintFactory {
  static primaryKey(
    columnName: string,
    autoincrement?: boolean,
    ordering?: Ordering,
  ): PrimaryKeyColumnConstraint {
    return {type: ColumnConstraintType.PRIMARY_KEY, columnName, autoincrement, ordering};
  }

  static notNull(columnName: string): NotNullColumnConstraint {
    return {type: ColumnConstraintType.NOT_NULL, columnName};
  }

  static unique(columnName: string): UniqueColumnConstraint {
    return {type: ColumnConstraintType.UNIQUE, columnName};
  }

  static default<T>(
    columnName: string,
    valueType: ValueType,
    value: T,
  ): DefaultColumnConstraint<T> {
    return {type: ColumnConstraintType.DEFAULT, columnName, valueType, value};
  }
}

export function convertColumnConstraintToSql(constraint: ColumnConstraint): string {
  switch (constraint.type) {
    case ColumnConstraintType.PRIMARY_KEY:
      return convertPrimaryKeyColumnConstraintToSql(constraint as PrimaryKeyColumnConstraint);
    case ColumnConstraintType.NOT_NULL:
      return convertNotNullColumnConstraintToSql(constraint as PrimaryKeyColumnConstraint);
    case ColumnConstraintType.UNIQUE:
      return convertUniqueColumnConstraintToSql(constraint as UniqueColumnConstraint);
    case ColumnConstraintType.DEFAULT:
      return convertDefaultColumnConstraintToSql(constraint as DefaultColumnConstraint<any>);
    default:
      // TODO: add support for additional constraints
      throw new Error(`Unrecognized ColumnConstraintType: ${constraint.type}`);
  }
}
