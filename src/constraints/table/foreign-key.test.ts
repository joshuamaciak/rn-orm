import {convertForeignKeyTableConstraintToSql, ForeignKeyTableConstraint} from './foreign-key';
import {TableConstraintType} from './table-constraint';

describe('convertForeignKeyTableConstraintToSql', () => {
  it('should convert constraint to sql when single column is provided', () => {
    const constraint: ForeignKeyTableConstraint = {
      type: TableConstraintType.FOREIGN_KEY,
      columnNames: ['col1'],
      foreignTableName: 'foreignTable',
      foreignColumnNames: ['foreignCol'],
    };

    const result = convertForeignKeyTableConstraintToSql(constraint);
    expect(result).toBe('FOREIGN KEY (col1) REFERENCES foreignTable (foreignCol)');
  });

  it('should convert constraint to sql when multiple columns are provided', () => {
    const constraint: ForeignKeyTableConstraint = {
      type: TableConstraintType.FOREIGN_KEY,
      columnNames: ['col1', 'col2'],
      foreignTableName: 'foreignTable',
      foreignColumnNames: ['foreignCol1', 'foreignCol2'],
    };

    const result = convertForeignKeyTableConstraintToSql(constraint);
    expect(result).toBe(
      'FOREIGN KEY (col1,col2) REFERENCES foreignTable (foreignCol1,foreignCol2)',
    );
  });
});
