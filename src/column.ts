import {
  ColumnConstraint,
  convertColumnConstraintToSql,
} from './constraints/column/column-constraint';

export interface Column {
  name: string;
  type: ColumnType;
  constraints: ColumnConstraint[];
}

/** Converts a Column to its equivalent SQL definition. */
export function convertColumnToSql(column: Column): string {
  const typeSql = convertColumnTypeToSql(column.type);
  const constraints = column.constraints.map(c => convertColumnConstraintToSql(c)).join(' ');
  if (constraints.length > 0) {
    return `${column.name} ${typeSql} ${constraints}`;
  }

  return `${column.name} ${typeSql}`;
}

function convertColumnTypeToSql(type: ColumnType): string {
  if (COLUMN_TYPE_SINGLE_ARGUMENT.includes(type.name)) {
    return `${type.name}(${type.args[0]})`;
  }
  if (COLUMN_TYPE_DOUBLE_ARGUMENT.includes(type.name)) {
    return `${type.name}(${type.args.join(',')})`;
  }
  return `${type.name}`;
}

/** An interface that describes a ColumnType */
export interface ColumnType {
  name: ColumnTypeName;
  args: number[];
}

/** A collection of possible ColumnTypeNames. */
export enum ColumnTypeName {
  INT = 'INT',
  INTEGER = 'INTEGER',
  TINY_INT = 'TINYINT',
  SMALL_INT = 'SMALLINT',
  MEDIUM_INT = 'MEDIUMINT',
  BIG_INT = 'BIGINT',
  UNSIGNED_BIG_INT = 'UNSIGNED BIG INT',
  INT2 = 'INT2',
  INT8 = 'INT8',
  CHARACTER = 'CHARACTER',
  VARCHAR = 'VARCHAR',
  VARYING_CHARACTER = 'VARYING CHARACTER',
  NCHAR = 'NCHAR',
  NATIVE_CHARACTER = 'NATIVE CHARACTER',
  NVARCHAR = 'NVARCHAR',
  TEXT = 'TEXT',
  CLOB = 'CLOB',
  BLOB = 'BLOB',
  REAL = 'REAL',
  DOUBLE = 'DOUBLE',
  DOUBLE_PRECISION = 'DOUBLE PRECISION',
  FLOAT = 'FLOAT',
  NUMERIC = 'NUMERIC',
  DECIMAL = 'DECIMAL',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
}

const COLUMN_TYPE_SINGLE_ARGUMENT = [
  ColumnTypeName.CHARACTER,
  ColumnTypeName.VARCHAR,
  ColumnTypeName.VARYING_CHARACTER,
  ColumnTypeName.NCHAR,
  ColumnTypeName.NATIVE_CHARACTER,
  ColumnTypeName.NVARCHAR,
];

const COLUMN_TYPE_DOUBLE_ARGUMENT = [ColumnTypeName.DECIMAL];
