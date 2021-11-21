import {ColumnConstraint} from './column-constraint';

export interface NotNullColumnConstraint extends ColumnConstraint {
  // TODO: add support for conflict clauses.
}

export function convertNotNullColumnConstraintToSql(constraint: NotNullColumnConstraint): string {
  return `${constraint.type}`;
}
