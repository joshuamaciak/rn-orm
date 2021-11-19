import {ColumnConstraintType} from '../../constraints/constraints';
import {addConstraintConfigToMetadata} from './constraint-util';

export function Unique(): PropertyDecorator {
  return (target, propertyKey) => {
    const config = {
      type: ColumnConstraintType.UNIQUE,
      columnName: propertyKey.toString(),
      args: [],
    };
    addConstraintConfigToMetadata(config, target);
  };
}
