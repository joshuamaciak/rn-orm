import {ColumnTypeName} from '../column';
import {Column, getColumns} from './column';

describe('@Column', () => {
  it('should store ColumnConfigs as metadata', () => {
    class Book {
      @Column()
      isbn: string;

      @Column({name: 'title'})
      title: string;

      @Column({name: 'author'})
      author: number;
    }

    const configs = getColumns(new Book());
    expect(configs).toEqual([
      {name: 'isbn', type: {name: ColumnTypeName.TEXT, args: []}},
      {name: 'title', type: {name: ColumnTypeName.TEXT, args: []}},
      {name: 'author', type: {name: ColumnTypeName.INTEGER, args: []}},
    ]);
  });

  describe('ColumnType inference', () => {
    it('should not infer when type is provided', () => {
      class Test {
        @Column({name: 'prop', type: {name: ColumnTypeName.FLOAT, args: []}})
        prop: number;
      }
      const configs = getColumns(new Test());
      expect(configs).toEqual([{name: 'prop', type: {name: ColumnTypeName.FLOAT, args: []}}]);
    });

    it('should infer INTEGER when property type is number', () => {
      class Test {
        @Column({name: 'prop'})
        prop: number;
      }
      const configs = getColumns(new Test());
      expect(configs).toEqual([{name: 'prop', type: {name: ColumnTypeName.INTEGER, args: []}}]);
    });

    it('should infer TEXT when property type is string', () => {
      class Test {
        @Column({name: 'prop'})
        prop: string;
      }
      const configs = getColumns(new Test());
      expect(configs).toEqual([{name: 'prop', type: {name: ColumnTypeName.TEXT, args: []}}]);
    });

    it('should infer BOOLEAN when property type is boolean', () => {
      class Test {
        @Column({name: 'prop'})
        prop: boolean;
      }
      const configs = getColumns(new Test());
      expect(configs).toEqual([{name: 'prop', type: {name: ColumnTypeName.BOOLEAN, args: []}}]);
    });
  });
});
