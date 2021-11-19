import {ColumnConstraintType} from '../../constraints/constraints';
import {Column} from '../column';
import {getColumnConstraintConfigs} from './constraint-util';
import {NotNull} from './not-null';

describe('@NotNull', () => {
  it('should store not null ColumnConstraintConfig as metadata', () => {
    class Test {
      @Column({})
      @NotNull()
      prop: boolean;
    }

    const configs = getColumnConstraintConfigs(new Test());
    expect(configs).toEqual([{type: ColumnConstraintType.NOT_NULL, columnName: 'prop', args: []}]);
  });
});
