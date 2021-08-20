import {ColumnTypeName} from '../column';
import {Column, Database, Entity} from './decorators';

@Entity({name: 'book'})
class Book {
  @Column({name: 'title', type: ColumnTypeName.TEXT})
  title: string;
  @Column({name: 'author', type: ColumnTypeName.TEXT})
  author: string;
}

@Database({name: 'nb', verison: '1', entities: [Book]})
class JoshDB {

}


describe('@Column', () => {
  test('should store ColumnConfig as property metadata', () => {
    // const b = new Book();
    // const config = getColumn(b, 'title');
    // expect(config).toEqual({name: 'title', type: ColumnTypeName.TEXT});
  });
});

describe.only('@Entity', () => {
    test('should store entity in entity manager', () => {

    });
});
