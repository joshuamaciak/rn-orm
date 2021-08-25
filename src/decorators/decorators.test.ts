import {ColumnTypeName} from '../column';
import {Column, Database, Entity, getColumns, getEntity} from './decorators';

@Entity({name: 'book'})
class Book {
  @Column({name: 'title', type: ColumnTypeName.TEXT})
  title: string;
  @Column({name: 'author', type: ColumnTypeName.TEXT})
  author: string;
}

@Database({name: 'nb', version: '1', entities: [Book]})
class JoshDB {}

describe('@Column', () => {
  test('should store ColumnConfigs as metadata', () => {
    const b = new Book();

    const configs = getColumns(b);
    expect(configs).toEqual([
      {name: 'title', type: ColumnTypeName.TEXT},
      {name: 'author', type: ColumnTypeName.TEXT},
    ]);
  });
});

describe('@Entity', () => {
  test('should store EntityConfig as metadata', () => {
    const b = new Book();

    const config = getEntity(b);
    expect(config).toEqual({name: 'book'});
  });
});
