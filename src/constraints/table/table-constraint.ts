import {EntityConfig} from '../../decorators/entity';
import {Constraint} from '../constraint';
import {
  convertForeignKeyTableConstraintToSql,
  createForeignKeyTableConstraint,
  ForeignKeyTableConstraint,
} from './foreign-key';
import {
  convertPrimaryKeyTableConstraintToSql,
  createPrimaryKeyTableConstraint,
  PrimaryKeyTableConstraint,
} from './primary-key';
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

/** Creates well-defined table constraints from the config provided by the @Entity decorator. */
export function createTableConstraints(entityConfig: EntityConfig): TableConstraint[] {
  const constraints = [];
  if (entityConfig.primaryKeys?.length) {
    constraints.push(createPrimaryKeyTableConstraint(entityConfig.primaryKeys));
  }

  const foreignKeyConstraints = entityConfig.foreignKeys.map(f =>
    createForeignKeyTableConstraint(f),
  );
  constraints.push(foreignKeyConstraints);
  return constraints;
}
