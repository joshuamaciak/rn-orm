import {
  ColumnConstraint,
  convertTableConstraintToSql,
  TableConstraint,
} from './constraints';
import {PersistenceManager} from './persistence-manager';

class Orm {
  constructor(readonly persistenceMangager: PersistenceManager, models: any[]) {
    // open database
    // if database is not created, create.
    // if additional models are present, check for Migrations
  }

  createDatabase() {
    this.persistenceMangager.initializeDatabase();
  }
}

function generateCreateTableSqlForModel(
  name: string,
  columns: Column[],
  columnConstraints: ColumnConstraint[],
  tableConstraints: TableConstraint[],
): string {
  const columnDefinitionsSqls = columns.map(c =>
    convertColumnToSql(c, columnConstraints),
  );
  const tableConstraintSqls = tableConstraints.map(t =>
    convertTableConstraintToSql(t),
  );

  const defs = [...columnDefinitionsSqls, ...tableConstraintSqls].join(',');

  return `CREATE TABLE IF NOT EXISTS ${name} (${defs})`;
}

/** Converts a Column to its equivalent SQL definition. */
function convertColumnToSql(
  column: Column,
  columnConstraints: ColumnConstraint[],
): string {
  const strParts = [`${column.name} ${column.type}`];
  const constraints = columnConstraints.filter(
    c => c.columnName === column.name,
  );
  for (const c of constraints) {
    strParts.push(` ${c.type}`);
  }
  return strParts.join('');
}

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
}

enum SqlDataType {
  VARCHAR = 'VARCHAR',
  INTEGER = 'INTEGER',
  BOOL = 'BOOL',
}
