import {TableConstraint} from './table-constraint';

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

export function convertForeignKeyTableConstraintToSql(
  constraint: ForeignKeyTableConstraint,
): string {
  const columnNames = constraint.columnNames.join(',');
  const foreignColumNames = constraint.foreignColumnNames.join(',');
  return `${constraint.type} (${columnNames}) REFERENCES ${constraint.foreignTableName} (${foreignColumNames})`;
}
