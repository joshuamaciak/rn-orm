import {ColumnTypeName} from '../column';
import {AbstractDatabase} from '../database';
import {Column, Database, Entity, getColumns, getEntityConfig} from './decorators';

@Entity({name: 'book'})
class Book {
  @Column({name: 'title'})
  title: string;
  @Column({name: 'author'})
  author: number;
}

@Database({name: 'nb', version: '1', entities: [Book]})
class JoshDB extends AbstractDatabase {}

describe.only('@Column', () => {
  test('should store ColumnConfigs as metadata', () => {
    const b = new Book();

    const configs = getColumns(b);
    expect(configs).toEqual([
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

describe.only('@Entity', () => {
  test('should store EntityConfig as metadata', () => {
    const b = new Book();

    const config = getEntityConfig(b);
    expect(config).toEqual({name: 'book'});
  });
});

describe('@Database', () => {
  test('should store EntityConfig as metadata', () => {
    const db = new JoshDB();
    db.initialize();
  });
});
