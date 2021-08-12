import {ColumnTypeName, convertColumnToSql} from './column';
import {ColumnConstraintType, PrimaryKeyColumnConstraint} from './constraints';

describe('convertColumnToSql', () => {
  describe('column type', () => {
    test('should not have arguments when ColumnType does not have any', () => {
      const column = {
        name: 'col',
        type: {
          name: ColumnTypeName.INTEGER,
          args: [],
        },
        constraints: [],
      };

      const result = convertColumnToSql(column);

      expect(result).toBe(`${column.name} INTEGER`);
    });

    test('should have one argument when ColumnType requires one argument', () => {
      const column = {
        name: 'col',
        type: {
          name: ColumnTypeName.VARCHAR,
          args: [123],
        },
        constraints: [],
      };

      const result = convertColumnToSql(column);

      expect(result).toBe(`${column.name} VARCHAR(123)`);
    });

    test('should have two arguments when ColumnType requires two arguments', () => {
      const column = {
        name: 'col',
        type: {
          name: ColumnTypeName.DECIMAL,
          args: [2, 5],
        },
        constraints: [],
      };

      const result = convertColumnToSql(column);

      expect(result).toBe(`${column.name} DECIMAL(2,5)`);
    });
  });

  describe('column constraints', () => {
    test('should contain column constraint when one is provided', () => {
      const columnName = 'col';
      const constraint: PrimaryKeyColumnConstraint = {
        type: ColumnConstraintType.PRIMARY_KEY,
        columnName,
      };
      const column = {
        name: columnName,
        type: {
          name: ColumnTypeName.INTEGER,
          args: [],
        },
        constraints: [constraint],
      };

      const result = convertColumnToSql(column);

      expect(result).toBe(`${columnName} INTEGER PRIMARY KEY`);
    });

    test('should contain column constraints when multiple are provided', () => {
      const columnName = 'col';
      const constraints = [
        {
          type: ColumnConstraintType.PRIMARY_KEY,
          columnName,
        },
        {
          type: ColumnConstraintType.NOT_NULL,
          columnName,
        },
      ];
      const column = {
        name: columnName,
        type: {
          name: ColumnTypeName.INTEGER,
          args: [],
        },
        constraints,
      };

      const result = convertColumnToSql(column);

      expect(result).toBe(`${columnName} INTEGER PRIMARY KEY NOT NULL`);
    });
  });
});
