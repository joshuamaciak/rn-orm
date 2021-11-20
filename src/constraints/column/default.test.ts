import {ColumnConstraintType} from './column-constraint';
import {convertDefaultColumnConstraintToSql, DefaultColumnConstraint, ValueType} from './default';

describe('DEFAULT', () => {
  it('should contain literal when valueType is LITERAL', () => {
    const constraint: DefaultColumnConstraint<string> = {
      type: ColumnConstraintType.DEFAULT,
      columnName: 'col1',
      valueType: ValueType.LITERAL,
      value: 'hello',
    };

    const result = convertDefaultColumnConstraintToSql(constraint);
    expect(result).toBe('DEFAULT "hello"');
  });

  it('should contain number when valueType is SIGNED_NUMBER', () => {
    const constraint: DefaultColumnConstraint<number> = {
      type: ColumnConstraintType.DEFAULT,
      columnName: 'col1',
      valueType: ValueType.SIGNED_NUMBER,
      value: 1234,
    };

    const result = convertDefaultColumnConstraintToSql(constraint);
    expect(result).toBe('DEFAULT 1234');
  });

  it('should contain expression when valueType is EXPRESSION', () => {
    const constraint: DefaultColumnConstraint<string> = {
      type: ColumnConstraintType.DEFAULT,
      columnName: 'col1',
      valueType: ValueType.EXPRESSION,
      value: 'SELECT hello FROM world',
    };

    const result = convertDefaultColumnConstraintToSql(constraint);
    expect(result).toBe('DEFAULT (SELECT hello FROM world)');
  });
});
