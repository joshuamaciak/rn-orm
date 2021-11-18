import {ColumnTypeName} from '../column';
import {ColumnConstraintType} from '../constraints';
import {
  Column,
  Default,
  Entity,
  getColumns,
  getColumnConstraintConfigs,
  getEntityConfig,
  NotNull,
  PrimaryKey,
  Unique,
} from './decorators';

describe('decorators', () => {
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

  describe('@Entity', () => {
    it('should store EntityConfig as metadata', () => {
      @Entity({name: 'test'})
      class Test {}
      const config = getEntityConfig(new Test());
      expect(config).toEqual({name: 'test'});
    });
  });

  describe('constraints', () => {
    describe('@PrimaryKey', () => {
      it('should store primary key ColumnConstraintConfig as metadata', () => {
        class Test {
          @Column({})
          @PrimaryKey()
          prop: boolean;
        }

        const configs = getColumnConstraintConfigs(new Test());
        expect(configs).toEqual([
          {type: ColumnConstraintType.PRIMARY_KEY, columnName: 'prop', args: []},
        ]);
      });
    });

    describe('@NotNull', () => {
      it('should store not null ColumnConstraintConfig as metadata', () => {
        class Test {
          @Column({})
          @NotNull()
          prop: boolean;
        }

        const configs = getColumnConstraintConfigs(new Test());
        expect(configs).toEqual([
          {type: ColumnConstraintType.NOT_NULL, columnName: 'prop', args: []},
        ]);
      });
    });

    describe('@Unique', () => {
      it('should store unique ColumnConstraintConfig as metadata', () => {
        class Test {
          @Column({})
          @Unique()
          prop: boolean;
        }

        const configs = getColumnConstraintConfigs(new Test());
        expect(configs).toEqual([
          {type: ColumnConstraintType.UNIQUE, columnName: 'prop', args: []},
        ]);
      });
    });

    describe('@Default', () => {
      it('should store default ColumnConstraintConfig as metadata', () => {
        class Test {
          @Column({})
          @Default('true')
          prop: boolean;
        }

        const configs = getColumnConstraintConfigs(new Test());
        expect(configs).toEqual([
          {type: ColumnConstraintType.DEFAULT, columnName: 'prop', args: ['true']},
        ]);
      });
    });
  });
});
