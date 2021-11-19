import {ColumnConstraintType} from '../../constraints/constraints';
import {addConstraintConfigToMetadata} from './constraint-util';

export function NotNull(): PropertyDecorator {
  return (target, propertyKey) => {
    const config = {
      type: ColumnConstraintType.NOT_NULL,
      columnName: propertyKey.toString(),
      args: [],
    };
    addConstraintConfigToMetadata(config, target);
  };
}
