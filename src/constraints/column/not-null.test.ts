import {ColumnConstraintType} from './column-constraint';
import {convertNotNullColumnConstraintToSql, NotNullColumnConstraint} from './not-null';

describe('convertNotNullColumnConstraintToSql', () => {
  it('should convert NOT_NULL constraint to sql', () => {
    const constraint: NotNullColumnConstraint = {
      type: ColumnConstraintType.NOT_NULL,
      columnName: 'col1',
    };

    const result = convertNotNullColumnConstraintToSql(constraint);
    expect(result).toBe('NOT NULL');
  });
});
