import {
  ColumnConstraintType,
  convertColumnConstraintToSql,
  convertTableConstraintToSql,
  DefaultColumnConstraint,
  ForeignKeyTableConstraint,
  NotNullColumnConstraint,
  Ordering,
  PrimaryKeyColumnConstraint,
  PrimaryKeyTableConstraint,
  TableConstraintType,
  UniqueColumnConstraint,
  UniqueTableConstraint,
  ValueType,
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

  test('should throw exception when unrecongnized constraint is supplied', () => {
    const constraint: UniqueTableConstraint = {
      type: TableConstraintType.CHECK,
      columnNames: ['col1', 'col2'],
    };

    expect(() => {
      convertTableConstraintToSql(constraint);
    }).toThrow();
  });
});

describe('convertColumnConstraintToSql', () => {
  describe('PRIMARY_KEY', () => {
    test('should not contain autoincrement and ordering when neither are present', () => {
      const constraint: PrimaryKeyColumnConstraint = {
        type: ColumnConstraintType.PRIMARY_KEY,
        columnName: 'col1',
      };

      const result = convertColumnConstraintToSql(constraint);
      expect(result).toBe('PRIMARY KEY');
    });

    test('should contain autoincrement when autoincrement is true', () => {
      const constraint: PrimaryKeyColumnConstraint = {
        type: ColumnConstraintType.PRIMARY_KEY,
        columnName: 'col1',
        autoincrement: true,
      };

      const result = convertColumnConstraintToSql(constraint);
      expect(result).toBe('PRIMARY KEY AUTOINCREMENT');
    });

    test('should not contain autoincrement when autoincrement is false', () => {
      const constraint: PrimaryKeyColumnConstraint = {
        type: ColumnConstraintType.PRIMARY_KEY,
        columnName: 'col1',
        autoincrement: false,
      };

      const result = convertColumnConstraintToSql(constraint);
      expect(result).toBe('PRIMARY KEY');
    });

    test('should contain ordering when ordering is present', () => {
      const constraint: PrimaryKeyColumnConstraint = {
        type: ColumnConstraintType.PRIMARY_KEY,
        columnName: 'col1',
        ordering: Ordering.ASC,
      };

      const result = convertColumnConstraintToSql(constraint);
      expect(result).toBe('PRIMARY KEY ASC');
    });
    test('should contain autoincrement and ordering when both are present', () => {
      const constraint: PrimaryKeyColumnConstraint = {
        type: ColumnConstraintType.PRIMARY_KEY,
        columnName: 'col1',
        ordering: Ordering.DESC,
        autoincrement: true,
      };

      const result = convertColumnConstraintToSql(constraint);
      expect(result).toBe('PRIMARY KEY DESC AUTOINCREMENT');
    });
  });

  describe('NOT_NULL', () => {
    it('should convert NOT_NULL constraint to sql', () => {
      const constraint: NotNullColumnConstraint = {
        type: ColumnConstraintType.NOT_NULL,
        columnName: 'col1',
      };

      const result = convertColumnConstraintToSql(constraint);
      expect(result).toBe('NOT NULL');
    });
  });

  describe('UNIQUE', () => {
    it('should convert UNIQUE constraint to sql', () => {
      const constraint: UniqueColumnConstraint = {
        type: ColumnConstraintType.UNIQUE,
        columnName: 'col1',
      };

      const result = convertColumnConstraintToSql(constraint);
      expect(result).toBe('UNIQUE');
    });
  });

  describe('DEFAULT', () => {
    it('should contain literal when valueType is LITERAL', () => {
      const constraint: DefaultColumnConstraint<string> = {
        type: ColumnConstraintType.DEFAULT,
        columnName: 'col1',
        valueType: ValueType.LITERAL,
        value: 'hello',
      };

      const result = convertColumnConstraintToSql(constraint);
      expect(result).toBe('DEFAULT "hello"');
    });

    it('should contain number when valueType is SIGNED_NUMBER', () => {
      const constraint: DefaultColumnConstraint<number> = {
        type: ColumnConstraintType.DEFAULT,
        columnName: 'col1',
        valueType: ValueType.SIGNED_NUMBER,
        value: 1234,
      };

      const result = convertColumnConstraintToSql(constraint);
      expect(result).toBe('DEFAULT 1234');
    });

    it('should contain expression when valueType is EXPRESSION', () => {
      const constraint: DefaultColumnConstraint<string> = {
        type: ColumnConstraintType.DEFAULT,
        columnName: 'col1',
        valueType: ValueType.EXPRESSION,
        value: 'SELECT hello FROM world',
      };

      const result = convertColumnConstraintToSql(constraint);
      expect(result).toBe('DEFAULT (SELECT hello FROM world)');
    });
  });
});
