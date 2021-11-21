import {ColumnConstraint} from './column-constraint';

export interface DefaultColumnConstraint<V> extends ColumnConstraint {
  valueType: ValueType;
  value: V;
}

export enum ValueType {
  LITERAL,
  SIGNED_NUMBER,
  EXPRESSION,
}

export function convertDefaultColumnConstraintToSql(constraint: DefaultColumnConstraint<any>): string {
  const value = convertValueTypeToSql(constraint.valueType, constraint.value);
  return `${constraint.type} ${value}`;
}

function convertValueTypeToSql(valueType: ValueType, value: any): string {
  switch (valueType) {
    case ValueType.LITERAL:
      return `"${value}"`;
    case ValueType.SIGNED_NUMBER:
      return `${value}`;
    case ValueType.EXPRESSION:
      return `(${value})`;
    default:
      throw new Error(`Unrecognized ValueType: ${valueType}`);
  }
}
