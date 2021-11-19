import {ColumnTypeName} from './column';
import {
  ColumnConstraintType,
  NotNullColumnConstraint,
  PrimaryKeyColumnConstraint,
  TableConstraintType,
} from './constraints/constraints';
import {convertTableToSql, Table} from './table';

describe('convertTableToSql', () => {
  describe('table name', () => {
    test('should include table name', () => {
      const table: Table = {
        name: 'table',
        columns: [{name: 'col', type: {name: ColumnTypeName.INTEGER, args: []}, constraints: []}],
        constraints: [],
      };

      const result = convertTableToSql(table);

      expect(result).toBe('CREATE TABLE IF NOT EXISTS table (col INTEGER)');
    });

    test('should include fully qualified table name when schemaName is present', () => {
      const table: Table = {
        name: 'table',
        schemaName: 'schema',
        columns: [{name: 'col', type: {name: ColumnTypeName.INTEGER, args: []}, constraints: []}],
        constraints: [],
      };

      const result = convertTableToSql(table);

      expect(result).toBe('CREATE TABLE IF NOT EXISTS schema.table (col INTEGER)');
    });
  });

  describe('columns', () => {
    test('should separate multiple columns by comma', () => {
      const table: Table = {
        name: 'table',
        columns: [
          {name: 'col', type: {name: ColumnTypeName.INTEGER, args: []}, constraints: []},
          {name: 'another_col', type: {name: ColumnTypeName.VARCHAR, args: [123]}, constraints: []},
        ],
        constraints: [],
      };

      const result = convertTableToSql(table);

      expect(result).toBe(
        'CREATE TABLE IF NOT EXISTS table (col INTEGER,another_col VARCHAR(123))',
      );
    });
  });

  describe('table constraint', () => {
    test('should list table constraint after columns', () => {
      const table: Table = {
        name: 'table',
        columns: [
          {
            name: 'col',
            type: {name: ColumnTypeName.INTEGER, args: []},
            constraints: [
              {
                type: ColumnConstraintType.NOT_NULL,
                columnName: 'col',
              } as NotNullColumnConstraint,
            ],
          },
        ],
        constraints: [{type: TableConstraintType.PRIMARY_KEY, columnNames: ['col']}],
      };

      const result = convertTableToSql(table);

      expect(result).toBe(
        'CREATE TABLE IF NOT EXISTS table (col INTEGER NOT NULL,PRIMARY KEY (col))',
      );
    });

    test('should separate multiple table constraints by commas', () => {
      const table: Table = {
        name: 'table',
        columns: [
          {
            name: 'col',
            type: {name: ColumnTypeName.INTEGER, args: []},
            constraints: [
              {
                type: ColumnConstraintType.NOT_NULL,
                columnName: 'col',
              } as NotNullColumnConstraint,
            ],
          },
        ],
        constraints: [
          {type: TableConstraintType.PRIMARY_KEY, columnNames: ['col']},
          {type: TableConstraintType.UNIQUE, columnNames: ['col']},
        ],
      };

      const result = convertTableToSql(table);

      expect(result).toBe(
        'CREATE TABLE IF NOT EXISTS table (col INTEGER NOT NULL,PRIMARY KEY (col),UNIQUE (col))',
      );
    });
  });
});
