import {ColumnDefinition, convertColumnDefinitionToSql} from '../column';
import {
  convertTableConstraintToSql,
  TableConstraint,
} from '../../constraints/table/table-constraint';
import {StatementArguments} from './statement';
import {trimExtraSpaces} from './utils';

export interface CreateTableArguments extends StatementArguments {
  ifNotExists?: boolean;
  temporary?: boolean;
  schemaName?: string;
  tableName: string;
  columns: ColumnDefinition[];
  tableConstraints: TableConstraint[];
  withoutRowId?: boolean;
}

// TODO: implement support for AS SELECT statements
export function createTable(args: CreateTableArguments): string {
  const columnDefinitionsSqls = args.columns.map(c => convertColumnDefinitionToSql(c));
  const tableConstraintSqls = args.tableConstraints.map(t => convertTableConstraintToSql(t));

  const defs = [...columnDefinitionsSqls, ...tableConstraintSqls].join(', ');

  const tempClause = args.temporary ? 'TEMPORARY' : '';

  const ifNotExistsClause = args.ifNotExists ? 'IF NOT EXISTS' : '';

  const fullyQualifiedTableName = args.schemaName
    ? `${args.schemaName}.${args.tableName}`
    : `${args.tableName}`;

  const withoutRowIdClause = args.withoutRowId ? 'WITHOUT ROWID' : '';

  const statement = `CREATE ${tempClause} TABLE ${ifNotExistsClause} ${fullyQualifiedTableName} (${defs}) ${withoutRowIdClause}`;
  return trimExtraSpaces(statement);
}
