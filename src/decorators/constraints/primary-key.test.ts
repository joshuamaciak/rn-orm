import {ColumnConstraintType} from '../../constraints/column/column-constraint';
import {Column} from '../column';
import {getColumnConstraintConfigs} from './constraint-util';
import {PrimaryKey} from './primary-key';

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
