import {TableConstraint} from './table-constraint';

/** A UNIQUE table constraint. */
export interface UniqueTableConstraint extends TableConstraint {
  // TODO: add support for conflict clauses.
}

export function convertUniqueTableConstraintToSql(constraint: UniqueTableConstraint): string {
  const columnNames = constraint.columnNames.join(',');
  return `${constraint.type} (${columnNames})`;
}
