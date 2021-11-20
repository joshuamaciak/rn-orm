import {convertPrimaryKeyTableConstraintToSql, PrimaryKeyTableConstraint} from './primary-key';
import {TableConstraintType} from './table-constraint';

describe('convertPrimaryKeyTableConstraintToSql', () => {
  it('should convert constraint to sql when single column is provided', () => {
    const constraint: PrimaryKeyTableConstraint = {
      type: TableConstraintType.PRIMARY_KEY,
      columnNames: ['col1'],
    };

    const result = convertPrimaryKeyTableConstraintToSql(constraint);
    expect(result).toBe('PRIMARY KEY (col1)');
  });

  it('should convert constraint to sql when multiple columns are provided', () => {
    const constraint: PrimaryKeyTableConstraint = {
      type: TableConstraintType.PRIMARY_KEY,
      columnNames: ['col1', 'col2'],
    };

    const result = convertPrimaryKeyTableConstraintToSql(constraint);
    expect(result).toBe('PRIMARY KEY (col1,col2)');
  });
});
