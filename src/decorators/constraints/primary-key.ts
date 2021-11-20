import {ColumnConstraintType} from '../../constraints/column/column-constraint';
import {addConstraintConfigToMetadata} from './constraint-util';

export function PrimaryKey(): PropertyDecorator {
  return (target, propertyKey) => {
    const config = {
      type: ColumnConstraintType.PRIMARY_KEY,
      columnName: propertyKey.toString(),
      args: [],
    };
    addConstraintConfigToMetadata(config, target);
  };
}
