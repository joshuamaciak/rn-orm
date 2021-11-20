import {ColumnConstraintType} from '../../constraints/column/column-constraint';
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
