import {
  ColumnConstraint,
  ColumnConstraintFactory,
  ColumnConstraintType,
} from './constraints/column/column-constraint';
import {ValueType} from './constraints/column/default';
import {ForeignKeyTableConstraint} from './constraints/table/foreign-key';
import {PrimaryKeyTableConstraint} from './constraints/table/primary-key';
import {TableConstraint, TableConstraintType} from './constraints/table/table-constraint';
import {ColumnConfig, getColumnsFromClass} from './decorators/column';
import {
  ColumnConstraintConfig,
  getColumnConstraintConfigsFromClass,
} from './decorators/constraints/constraint-util';
import {getDatabaseConfig} from './decorators/constraints/database';
import {EntityConfig, ForeignKeyConfig, getEntityConfigFromClass} from './decorators/entity';

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
      const tableConstraints = getTableConstraints(entityConfig);
      const columnConstraints = getColumnConstraints(columnConstraintConfigs);
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

function getTableConstraints(entityConfig: EntityConfig): TableConstraint[] {
  const constraints = [];
  if (entityConfig.primaryKeys?.length) {
    constraints.push(createPrimaryKeyTableConstraint(entityConfig.primaryKeys));
  }

  const foreignKeyConstraints = entityConfig.foreignKeys.map(f =>
    createForeignKeyTableConstraint(f),
  );
  constraints.push(foreignKeyConstraints);
  return constraints;
}

function createPrimaryKeyTableConstraint(columnNames: string[]): PrimaryKeyTableConstraint {
  return {type: TableConstraintType.PRIMARY_KEY, columnNames};
}

function createForeignKeyTableConstraint(config: ForeignKeyConfig): ForeignKeyTableConstraint {
  return {
    type: TableConstraintType.FOREIGN_KEY,
    columnNames: config.columnNames,
    foreignTableName: '', // TODO: get foreign table name from config.foreignEntity
    foreignColumnNames: config.foreignColumnNames,
  };
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

function getColumnConstraints(constraintConfigs: ColumnConstraintConfig[]): ColumnConstraint[] {
  return constraintConfigs.map(c => createColumnConstraint(c));
}

function createColumnConstraint(config: ColumnConstraintConfig): ColumnConstraint {
  switch (config.type) {
    case ColumnConstraintType.PRIMARY_KEY:
      return ColumnConstraintFactory.primaryKey(config.columnName);
    case ColumnConstraintType.NOT_NULL:
      return ColumnConstraintFactory.notNull(config.columnName);
    case ColumnConstraintType.UNIQUE:
      return ColumnConstraintFactory.unique(config.columnName);
    case ColumnConstraintType.DEFAULT:
      const value = config.args[0];
      return ColumnConstraintFactory.default(config.columnName, inferValueType(value), value);
    default:
      throw new Error(`Unrecognized constraint type ${config.type}`);
  }
}

function inferValueType(arg: any): ValueType {
  switch (typeof arg) {
    case 'string':
      // TODO: we need a way to distinguish between literals & expressions.
      return ValueType.LITERAL;
    case 'number':
      return ValueType.SIGNED_NUMBER;
  }
}
