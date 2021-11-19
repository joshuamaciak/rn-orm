import {ColumnConstraintType} from '../../constraints/constraints';
import {addConstraintConfigToMetadata} from './constraint-util';

export function Default(expression: string): PropertyDecorator {
  return (target, propertyKey) => {
    const config = {
      type: ColumnConstraintType.DEFAULT,
      columnName: propertyKey.toString(),
      args: [expression],
    };
    addConstraintConfigToMetadata(config, target);
  };
}
