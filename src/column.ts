import {ColumnConstraint} from './constraints';

/** Converts a Column to its equivalent SQL definition. */
export function convertColumnToSql(
  name: string,
  type: ColumnType,
  columnConstraints: ColumnConstraint[],
): string {
  const typeSql = convertColumnTypeToSql(type);
  const constraints = columnConstraints.join(' ');
  return `${name} ${typeSql} ${constraints}`;
}

function convertColumnTypeToSql(type: ColumnType): string {
  if (!type.args.length) {
    return `${type}`;
  }

  return `${type}(${type.args.join(',')})`;
}

/** An interface that describes a ColumnType */
interface ColumnType {
  name: ColumnTypeName;
  args: number[];
}

/** A collection of possible ColumnTypeNames. */
enum ColumnTypeName {
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
