import {
  convertTableConstraintToSql,
  ForeignKeyTableConstraint,
  PrimaryKeyTableConstraint,
  TableConstraintType,
  UniqueTableConstraint,
} from './constraints';

describe('convertTableConstraintToSql', () => {
  describe('PRIMARY_KEY', () => {
    test('should convert constraint to sql when single column is provided', () => {
      const constraint: PrimaryKeyTableConstraint = {
        type: TableConstraintType.PRIMARY_KEY,
        columnNames: ['col1'],
      };

      const result = convertTableConstraintToSql(constraint);
      expect(result).toBe('PRIMARY KEY (col1)');
    });

    test('should convert constraint to sql when multiple columns are provided', () => {
      const constraint: PrimaryKeyTableConstraint = {
        type: TableConstraintType.PRIMARY_KEY,
        columnNames: ['col1', 'col2'],
      };

      const result = convertTableConstraintToSql(constraint);
      expect(result).toBe('PRIMARY KEY (col1,col2)');
    });

    describe('FOREIGN_KEY', () => {
      test('should convert constraint to sql when single column is provided', () => {
        const constraint: ForeignKeyTableConstraint = {
          type: TableConstraintType.FOREIGN_KEY,
          columnNames: ['col1'],
          foreignTableName: 'foreignTable',
          foreignColumnNames: ['foreignCol'],
        };

        const result = convertTableConstraintToSql(constraint);
        expect(result).toBe('FOREIGN KEY (col1) REFERENCES foreignTable (foreignCol)');
      });

      test('should convert constraint to sql when multiple columns are provided', () => {
        const constraint: ForeignKeyTableConstraint = {
          type: TableConstraintType.FOREIGN_KEY,
          columnNames: ['col1', 'col2'],
          foreignTableName: 'foreignTable',
          foreignColumnNames: ['foreignCol1', 'foreignCol2'],
        };

        const result = convertTableConstraintToSql(constraint);
        expect(result).toBe(
          'FOREIGN KEY (col1,col2) REFERENCES foreignTable (foreignCol1,foreignCol2)',
        );
      });
    });

    describe('UNIQUE', () => {
      test('should convert constraint to sql when single column is provided', () => {
        const constraint: UniqueTableConstraint = {
          type: TableConstraintType.UNIQUE,
          columnNames: ['col1'],
        };

        const result = convertTableConstraintToSql(constraint);
        expect(result).toBe('UNIQUE (col1)');
      });

      test('should convert constraint to sql when multiple columns are provided', () => {
        const constraint: UniqueTableConstraint = {
          type: TableConstraintType.UNIQUE,
          columnNames: ['col1', 'col2'],
        };

        const result = convertTableConstraintToSql(constraint);
        expect(result).toBe('UNIQUE (col1,col2)');
      });
    });
  });
});
