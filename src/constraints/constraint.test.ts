import {ColumnConstraintType, convertColumnConstraintToSql} from './column/column-constraint';
import {DefaultColumnConstraint, ValueType} from './column/default';
import {NotNullColumnConstraint} from './column/not-null';
import {PrimaryKeyColumnConstraint} from './column/primary-key';
import {UniqueColumnConstraint} from './column/unique';
import {ForeignKeyTableConstraint} from './table/foreign-key';
import {PrimaryKeyTableConstraint} from './table/primary-key';
import {convertTableConstraintToSql, TableConstraintType} from './table/table-constraint';
import {UniqueTableConstraint} from './table/unique';

describe('convertTableConstraintToSql', () => {
  it('should convert primary key constraint to sql', () => {
    const constraint: PrimaryKeyTableConstraint = {
      type: TableConstraintType.PRIMARY_KEY,
      columnNames: ['col1'],
    };

    const result = convertTableConstraintToSql(constraint);
    expect(result).toBe('PRIMARY KEY (col1)');
  });

  it('should convert foreign key constraint to sql', () => {
    const constraint: ForeignKeyTableConstraint = {
      type: TableConstraintType.FOREIGN_KEY,
      columnNames: ['col1'],
      foreignTableName: 'foreignTable',
      foreignColumnNames: ['foreignCol'],
    };

    const result = convertTableConstraintToSql(constraint);
    expect(result).toBe('FOREIGN KEY (col1) REFERENCES foreignTable (foreignCol)');
  });

  it('should convert unique constraint to sql', () => {
    const constraint: UniqueTableConstraint = {
      type: TableConstraintType.UNIQUE,
      columnNames: ['col1'],
    };

    const result = convertTableConstraintToSql(constraint);
    expect(result).toBe('UNIQUE (col1)');
  });

  it('should throw exception when unrecongnized constraint is supplied', () => {
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
  it('should convert primary key constraint to sql', () => {
    const constraint: PrimaryKeyColumnConstraint = {
      type: ColumnConstraintType.PRIMARY_KEY,
      columnName: 'col1',
    };

    const result = convertColumnConstraintToSql(constraint);
    expect(result).toBe('PRIMARY KEY');
  });

  it('should convert not null constraint to sql', () => {
    const constraint: NotNullColumnConstraint = {
      type: ColumnConstraintType.NOT_NULL,
      columnName: 'col1',
    };

    const result = convertColumnConstraintToSql(constraint);
    expect(result).toBe('NOT NULL');
  });

  it('should convert unique constraint to sql', () => {
    const constraint: UniqueColumnConstraint = {
      type: ColumnConstraintType.UNIQUE,
      columnName: 'col1',
    };

    const result = convertColumnConstraintToSql(constraint);
    expect(result).toBe('UNIQUE');
  });

  it('should convert default constraint to sql', () => {
    const constraint: DefaultColumnConstraint<string> = {
      type: ColumnConstraintType.DEFAULT,
      columnName: 'col1',
      valueType: ValueType.LITERAL,
      value: 'hello',
    };

    const result = convertColumnConstraintToSql(constraint);
    expect(result).toBe('DEFAULT "hello"');
  });
});
