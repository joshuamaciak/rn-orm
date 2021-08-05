/** Represents any SQL constraint. One of TableConstraint or ColumnConstraint. */
interface Constraint {
  type: TableConstraintType | ColumnConstraintType;
}

/** A TableConstraint represents a constraint on a SQL table. */
export interface TableConstraint extends Constraint {
  /** The type of this TableConstraint. */
  type: TableConstraintType;
  /** The name(s) of the column(s) this TableConstraint is enforced on. */
  columnNames: string[];
}

/**
 *  A PRIMARY KEY table constraint of the form:
 *    PRIMARY KEY (columnNames)
 */
export interface PrimaryKeyTableConstraint extends TableConstraint {
  // TODO: add support for conflict clauses.
}

/**
 *  A FOREIGN KEY table constraint of the form:
 *    FOREIGN KEY (columnNames) REFERENCES foreignTableName (foreignColumNames)
 */
export interface ForeignKeyTableConstraint extends TableConstraint {
  /** The table the foreign column(s) belongs to. */
  foreignTableName: string;
  /** The foreign column(s) that are referenced by this constraint */
  foreignColumnNames: string[];
  // TODO: add support advanced for actions & deferrable.
}

/** A UNIQUE table constraint. */
export interface UniqueTableConstraint extends TableConstraint {
  // TODO: add support for conflict clauses.
}

export interface ColumnConstraint extends Constraint {
  type: ColumnConstraintType;
  columnName: string;
}

/** A collection of possible column constraints in SQL. */
enum ColumnConstraintType {
  PRIMARY_KEY = 'PRIMARY KEY',
  NOT_NULL = 'NOT NULL',
  UNIQUE = 'UNIQUE',
  CHECK = 'CHECK',
  DEFAULT = 'DEFAULT',
  COLLATE = 'COLLATE',
  FOREIGN_KEY = 'FOREIGN KEY',
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

function convertPrimaryKeyTableConstraintToSql(constraint: PrimaryKeyTableConstraint): string {
  const columnNames = constraint.columnNames.join(',');
  return `${constraint.type} (${columnNames})`;
}

function convertUniqueTableConstraintToSql(constraint: UniqueTableConstraint): string {
  const columnNames = constraint.columnNames.join(',');
  return `${constraint.type} (${columnNames})`;
}

function convertForeignKeyTableConstraintToSql(constraint: ForeignKeyTableConstraint): string {
  const columnNames = constraint.columnNames.join(',');
  const foreignColumNames = constraint.foreignColumnNames.join(',');
  return `${constraint.type} (${columnNames}) REFERENCES ${constraint.foreignTableName} (${foreignColumNames})`;
}
