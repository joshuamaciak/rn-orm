import {ColumnConstraintType} from '../../constraints/column/column-constraint';
import {NotNullColumnConstraint} from '../../constraints/column/not-null';
import {TableConstraintType} from '../../constraints/table/table-constraint';
import {ColumnTypeName} from '../column';
import {createTable, CreateTableArguments} from './create-table';

describe('createTable', () => {
  describe('table name', () => {
    it('should include table name', () => {
      const args: CreateTableArguments = {
        tableName: 'table',
        columns: [{name: 'col', type: {name: ColumnTypeName.INTEGER, args: []}, constraints: []}],
        tableConstraints: [],
      };

      const result = createTable(args);

      expect(result).toBe('CREATE TABLE table (col INTEGER)');
    });

    it('should include fully qualified table name when schemaName is present', () => {
      const table: CreateTableArguments = {
        tableName: 'table',
        schemaName: 'schema',
        columns: [{name: 'col', type: {name: ColumnTypeName.INTEGER, args: []}, constraints: []}],
        tableConstraints: [],
      };

      const result = createTable(table);

      expect(result).toBe('CREATE TABLE schema.table (col INTEGER)');
    });
  });

  describe('temporary', () => {
    it('should include TEMPORARY clause when temporary is true', () => {
      const args: CreateTableArguments = {
        tableName: 'table',
        temporary: true,
        columns: [{name: 'col', type: {name: ColumnTypeName.INTEGER, args: []}, constraints: []}],
        tableConstraints: [],
      };

      const result = createTable(args);

      expect(result).toBe('CREATE TEMPORARY TABLE table (col INTEGER)');
    });
  });

  describe('ifNotExists', () => {
    it('should include IF NOT EXISTS clause when ifNotExists is true', () => {
      const args: CreateTableArguments = {
        tableName: 'table',
        ifNotExists: true,
        columns: [{name: 'col', type: {name: ColumnTypeName.INTEGER, args: []}, constraints: []}],
        tableConstraints: [],
      };

      const result = createTable(args);

      expect(result).toBe('CREATE TABLE IF NOT EXISTS table (col INTEGER)');
    });
  });

  describe('withoutRowId', () => {
    it('should include WITHOUT ROWID clause when withoutRowId is true', () => {
      const args: CreateTableArguments = {
        tableName: 'table',
        withoutRowId: true,
        columns: [{name: 'col', type: {name: ColumnTypeName.INTEGER, args: []}, constraints: []}],
        tableConstraints: [],
      };

      const result = createTable(args);

      expect(result).toBe('CREATE TABLE table (col INTEGER) WITHOUT ROWID');
    });
  });

  describe('columns', () => {
    it('should separate multiple columns by comma', () => {
      const table: CreateTableArguments = {
        tableName: 'table',
        columns: [
          {name: 'col', type: {name: ColumnTypeName.INTEGER, args: []}, constraints: []},
          {name: 'another_col', type: {name: ColumnTypeName.VARCHAR, args: [123]}, constraints: []},
        ],
        tableConstraints: [],
      };

      const result = createTable(table);

      expect(result).toBe('CREATE TABLE table (col INTEGER,another_col VARCHAR(123))');
    });
  });

  describe('table constraint', () => {
    it('should list table constraint after columns', () => {
      const table: CreateTableArguments = {
        tableName: 'table',
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
        tableConstraints: [{type: TableConstraintType.PRIMARY_KEY, columnNames: ['col']}],
      };

      const result = createTable(table);

      expect(result).toBe('CREATE TABLE table (col INTEGER NOT NULL, PRIMARY KEY (col))');
    });

    it('should separate multiple table constraints by commas', () => {
      const table: CreateTableArguments = {
        tableName: 'table',
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
        tableConstraints: [
          {type: TableConstraintType.PRIMARY_KEY, columnNames: ['col']},
          {type: TableConstraintType.UNIQUE, columnNames: ['col']},
        ],
      };

      const result = createTable(table);

      expect(result).toBe(
        'CREATE TABLE table (col INTEGER NOT NULL, PRIMARY KEY (col), UNIQUE (col))',
      );
    });
  });
});
