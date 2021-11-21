import {ColumnConstraint} from './column-constraint';

export interface UniqueColumnConstraint extends ColumnConstraint {
  // TODO: add support for conflict clauses.
}

export function convertUniqueColumnConstraintToSql(constraint: UniqueColumnConstraint): string {
  return `${constraint.type}`;
}
