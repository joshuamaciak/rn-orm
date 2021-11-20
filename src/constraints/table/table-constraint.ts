import {Constraint} from '../constraint';
import {convertForeignKeyTableConstraintToSql, ForeignKeyTableConstraint} from './foreign-key';
import {convertPrimaryKeyTableConstraintToSql, PrimaryKeyTableConstraint} from './primary-key';
import {convertUniqueTableConstraintToSql, UniqueTableConstraint} from './unique';

/** A TableConstraint represents a constraint on a SQL table. */
export interface TableConstraint extends Constraint {
  /** The type of this TableConstraint. */
  type: TableConstraintType;
  /** The name(s) of the column(s) this TableConstraint is enforced on. */
  columnNames: string[];
}

/** A collection of possible table constraints in SQL. */
export enum TableConstraintType {
  PRIMARY_KEY = 'PRIMARY KEY',
  FOREIGN_KEY = 'FOREIGN KEY',
  UNIQUE = 'UNIQUE',
  CHECK = 'CHECK',
}

/** Converts a TableConstraint to its equivalent SQL representation. */
export function convertTableConstraintToSql(constraint: TableConstraint): string {
  switch (constraint.type) {
    case TableConstraintType.PRIMARY_KEY:
      return convertPrimaryKeyTableConstraintToSql(constraint as PrimaryKeyTableConstraint);
    case TableConstraintType.FOREIGN_KEY:
      return convertForeignKeyTableConstraintToSql(constraint as ForeignKeyTableConstraint);
    case TableConstraintType.UNIQUE:
      return convertUniqueTableConstraintToSql(constraint as UniqueTableConstraint);
    // TODO: add support for CHECK table constraint.
    default:
      throw new Error(`Unrecognized TableConstraintType: ${constraint.type}`);
  }
}
