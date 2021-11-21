import {
  ColumnConstraint,
  ColumnConstraintType,
  createColumnConstraints,
} from './constraints/column/column-constraint';
import {createTableConstraints, TableConstraint} from './constraints/table/table-constraint';
import {ColumnConfig, getColumnsFromClass} from './decorators/column';
import {
  ColumnConstraintConfig,
  getColumnConstraintConfigsFromClass,
} from './decorators/constraints/constraint-util';
import {getDatabaseConfig} from './decorators/constraints/database';
import {EntityConfig, getEntityConfigFromClass} from './decorators/entity';

/**
 * This is a temporary construct until I can build out support for
 * Entity-specific DAOs. Any class with the @Database decorator should
 * extend this class to add support for generic CRUD entity operations.
 */
export class AbstractDatabase {
  initialize(): void {
    const dbConfig = getDatabaseConfig(this);
    if (!dbConfig) {
      throw new Error('Classes that extend Database must have @Database decorator');
    }

    for (const e of dbConfig.entities) {
      const entityConfig = getEntityConfigFromClass(e);
      const cols = getColumnsFromClass(e);
      const columnConstraintConfigs = getColumnConstraintConfigsFromClass(e);
      validateEntity(entityConfig, columnConstraintConfigs);
      const tableConstraints = createTableConstraints(entityConfig);
      const columnConstraints = createColumnConstraints(columnConstraintConfigs);
      console.log(`${e.name}`, cols);
      console.log('tableConstraints', tableConstraints);
      console.log('columnConstraints', columnConstraints);
    }
  }

  createTableIfNotExists(
    entityConfig: EntityConfig,
    columnConfigs: ColumnConfig[],
    tableConstraints: TableConstraint[],
    columnConstraints: ColumnConstraint[],
  ) {
    // TODO: implement create table
  }
}

/**
 * Performs some preliminary validation of an Entity. If any validation fails, this
 * function will throw.
 */
function validateEntity(
  entityConfig: EntityConfig,
  constraintConfigs: ColumnConstraintConfig[],
): void {
  const columnConstraintsByType = groupColumnConstraintsByType(constraintConfigs);
  const primaryKeyColumnConstraintCount = columnConstraintsByType.get(
    ColumnConstraintType.PRIMARY_KEY,
  ).length;
  if (primaryKeyColumnConstraintCount > 1) {
    throw new Error('Entities with composite primary keys should use EntityConfig.primaryKeys');
  }

  if (entityConfig.primaryKeys?.length && primaryKeyColumnConstraintCount > 0) {
    throw new Error('Entity with primaryKeys cannot have additional @PrimaryKey fields');
  }
}

function groupColumnConstraintsByType(
  configs: ColumnConstraintConfig[],
): Map<ColumnConstraintType, ColumnConstraintConfig[]> {
  const map = new Map<ColumnConstraintType, ColumnConstraintConfig[]>();
  for (const c of configs) {
    const entry = map.get(c.type) ?? [];
    entry.push(c);
    map.set(c.type, entry);
  }
  return map;
}
