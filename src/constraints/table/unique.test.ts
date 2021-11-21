import {TableConstraintType} from './table-constraint';
import {convertUniqueTableConstraintToSql, UniqueTableConstraint} from './unique';

describe('convertUniqueTableConstraintToSql', () => {
  it('should convert constraint to sql when single column is provided', () => {
    const constraint: UniqueTableConstraint = {
      type: TableConstraintType.UNIQUE,
      columnNames: ['col1'],
    };

    const result = convertUniqueTableConstraintToSql(constraint);
    expect(result).toBe('UNIQUE (col1)');
  });

  it('should convert constraint to sql when multiple columns are provided', () => {
    const constraint: UniqueTableConstraint = {
      type: TableConstraintType.UNIQUE,
      columnNames: ['col1', 'col2'],
    };

    const result = convertUniqueTableConstraintToSql(constraint);
    expect(result).toBe('UNIQUE (col1,col2)');
  });
});
