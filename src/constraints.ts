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

export interface PrimaryKeyColumnConstraint extends ColumnConstraint {
  type: ColumnConstraintType.PRIMARY_KEY
  ordering?: Ordering;
  // TODO: add support for conflict clauses.
  autoincrement?: boolean;
}

export interface NotNullColumnConstraint extends ColumnConstraint {
  // TODO: add support for conflict clauses.
}

export interface UniqueColumnConstraint extends ColumnConstraint {
  // TODO: add support for conflict clauses.
}

export interface DefaultColumnConstraint<V> extends ColumnConstraint {
  valueType: ValueType;
  value: V;
}

export enum ValueType {
  LITERAL,
  SIGNED_NUMBER,
  EXPRESSION,
}

export enum Ordering {
  ASC = 'ASC',
  DESC = 'DESC',
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
/** A collection of possible table constraints in SQL. */
export enum TableConstraintType {
  PRIMARY_KEY = 'PRIMARY KEY',
  FOREIGN_KEY = 'FOREIGN KEY',
  UNIQUE = 'UNIQUE',
  CHECK = 'CHECK',
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

function convertPrimaryKeyColumnConstraintToSql(constraint: PrimaryKeyColumnConstraint): string {
  const ordering = constraint.ordering ? ` ${constraint.ordering}` : '';
  const autoincrement = constraint.autoincrement ? ' AUTOINCREMENT' : '';
  return `${constraint.type}${ordering}${autoincrement}`;
}

function convertNotNullColumnConstraintToSql(constraint: NotNullColumnConstraint): string {
  return `${constraint.type}`;
}

function convertUniqueColumnConstraintToSql(constraint: UniqueColumnConstraint): string {
  return `${constraint.type}`;
}

function convertDefaultColumnConstraintToSql(constraint: DefaultColumnConstraint<any>): string {
  const value = convertValueTypeToSql(constraint.valueType, constraint.value);
  return `${constraint.type} ${value}`;
}

function convertValueTypeToSql(valueType: ValueType, value: any): string {
  switch (valueType) {
    case ValueType.LITERAL:
      return `"${value}"`;
    case ValueType.SIGNED_NUMBER:
      return `${value}`;
    case ValueType.EXPRESSION:
      return `(${value})`;
    default:
      throw new Error(`Unrecognized ValueType: ${valueType}`);
  }
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
