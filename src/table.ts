import {Column, convertColumnToSql} from './column';
import {convertTableConstraintToSql, TableConstraint} from './constraints/table/table-constraint';

export interface Table {
  name: string;
  schemaName?: string;
  columns: Column[];
  constraints: TableConstraint[];
}

export function convertTableToSql(table: Table): string {
  const columnDefinitionsSqls = table.columns.map(c => convertColumnToSql(c));
  const tableConstraintSqls = table.constraints.map(t => convertTableConstraintToSql(t));

  const defs = [...columnDefinitionsSqls, ...tableConstraintSqls].join(',');

  const fullyQualifiedTableName = table.schemaName
    ? `${table.schemaName}.${table.name}`
    : `${table.name}`;

  return `CREATE TABLE IF NOT EXISTS ${fullyQualifiedTableName} (${defs})`;
}
