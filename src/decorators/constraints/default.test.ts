import {ColumnConstraintType} from '../../constraints/column/column-constraint';
import {Column} from '../column';
import {getColumnConstraintConfigs} from './constraint-util';
import {Default} from './default';

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
