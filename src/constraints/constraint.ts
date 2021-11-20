import {ColumnConstraintType} from './column/column-constraint';
import {TableConstraintType} from './table/table-constraint';

/** Represents any SQL constraint. One of TableConstraint or ColumnConstraint. */
export interface Constraint {
  type: TableConstraintType | ColumnConstraintType;
}
