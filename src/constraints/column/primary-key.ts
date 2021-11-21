import {ColumnConstraint, ColumnConstraintType} from './column-constraint';

export interface PrimaryKeyColumnConstraint extends ColumnConstraint {
  type: ColumnConstraintType.PRIMARY_KEY;
  ordering?: Ordering;
  // TODO: add support for conflict clauses.
  autoincrement?: boolean;
}

export enum Ordering {
  ASC = 'ASC',
  DESC = 'DESC',
}

export function convertPrimaryKeyColumnConstraintToSql(constraint: PrimaryKeyColumnConstraint): string {
  const ordering = constraint.ordering ? ` ${constraint.ordering}` : '';
  const autoincrement = constraint.autoincrement ? ' AUTOINCREMENT' : '';
  return `${constraint.type}${ordering}${autoincrement}`;
}
