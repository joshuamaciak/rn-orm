import {TableConstraint} from './table-constraint';

/**
 *  A PRIMARY KEY table constraint of the form:
 *    PRIMARY KEY (columnNames)
 */
export interface PrimaryKeyTableConstraint extends TableConstraint {
  // TODO: add support for conflict clauses.
}

export function convertPrimaryKeyTableConstraintToSql(constraint: PrimaryKeyTableConstraint): string {
  const columnNames = constraint.columnNames.join(',');
  return `${constraint.type} (${columnNames})`;
}
