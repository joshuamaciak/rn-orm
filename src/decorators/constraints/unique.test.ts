import {ColumnConstraintType} from '../../constraints/constraints';
import {Column} from '../column';
import {getColumnConstraintConfigs} from './constraint-util';
import {Unique} from './unique';

describe('@Unique', () => {
  it('should store unique ColumnConstraintConfig as metadata', () => {
    class Test {
      @Column({})
      @Unique()
      prop: boolean;
    }

    const configs = getColumnConstraintConfigs(new Test());
    expect(configs).toEqual([{type: ColumnConstraintType.UNIQUE, columnName: 'prop', args: []}]);
  });
});
