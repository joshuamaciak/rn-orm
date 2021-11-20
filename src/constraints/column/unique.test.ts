import {ColumnConstraintType} from './column-constraint';
import {convertUniqueColumnConstraintToSql, UniqueColumnConstraint} from './unique';

describe('convertUniqueColumnConstraintToSql', () => {
  it('should convert UNIQUE constraint to sql', () => {
    const constraint: UniqueColumnConstraint = {
      type: ColumnConstraintType.UNIQUE,
      columnName: 'col1',
    };

    const result = convertUniqueColumnConstraintToSql(constraint);
    expect(result).toBe('UNIQUE');
  });
});
