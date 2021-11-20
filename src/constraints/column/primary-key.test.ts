import {ColumnConstraintType} from './column-constraint';
import {
  convertPrimaryKeyColumnConstraintToSql,
  Ordering,
  PrimaryKeyColumnConstraint,
} from './primary-key';

describe('convertPrimaryKeyColumnConstraintToSql', () => {
  it('should not contain autoincrement and ordering when neither are present', () => {
    const constraint: PrimaryKeyColumnConstraint = {
      type: ColumnConstraintType.PRIMARY_KEY,
      columnName: 'col1',
    };

    const result = convertPrimaryKeyColumnConstraintToSql(constraint);
    expect(result).toBe('PRIMARY KEY');
  });

  it('should contain autoincrement when autoincrement is true', () => {
    const constraint: PrimaryKeyColumnConstraint = {
      type: ColumnConstraintType.PRIMARY_KEY,
      columnName: 'col1',
      autoincrement: true,
    };

    const result = convertPrimaryKeyColumnConstraintToSql(constraint);
    expect(result).toBe('PRIMARY KEY AUTOINCREMENT');
  });

  it('should not contain autoincrement when autoincrement is false', () => {
    const constraint: PrimaryKeyColumnConstraint = {
      type: ColumnConstraintType.PRIMARY_KEY,
      columnName: 'col1',
      autoincrement: false,
    };

    const result = convertPrimaryKeyColumnConstraintToSql(constraint);
    expect(result).toBe('PRIMARY KEY');
  });

  it('should contain ordering when ordering is present', () => {
    const constraint: PrimaryKeyColumnConstraint = {
      type: ColumnConstraintType.PRIMARY_KEY,
      columnName: 'col1',
      ordering: Ordering.ASC,
    };

    const result = convertPrimaryKeyColumnConstraintToSql(constraint);
    expect(result).toBe('PRIMARY KEY ASC');
  });

  it('should contain autoincrement and ordering when both are present', () => {
    const constraint: PrimaryKeyColumnConstraint = {
      type: ColumnConstraintType.PRIMARY_KEY,
      columnName: 'col1',
      ordering: Ordering.DESC,
      autoincrement: true,
    };

    const result = convertPrimaryKeyColumnConstraintToSql(constraint);
    expect(result).toBe('PRIMARY KEY DESC AUTOINCREMENT');
  });
});
