import {Column} from './column';
import {
  ColumnConfig,
  EntityConfig,
  getColumnsFromClass,
  getConstraintConfigsFromClass,
  getDatabaseConfig,
  getEntityConfigFromClass,
} from './decorators/decorators';
import {Table} from './table';

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
      const constraintConfigs = getConstraintConfigsFromClass(e);
      console.log(`${e.name}`, cols);
      console.log('constraints', constraintConfigs);
    }
  }

  add(entity: any) {}

  createTableIfNotExists(entityConfig: EntityConfig, columnConfigs: ColumnConfig[]) {
    // TODO add constraints
    const columnDefs: Column[] = columnConfigs.map(
      c => ({name: c.name, type: undefined, constraints: []} as Column),
    );
    const table: Table = {
      name: entityConfig.name,
      columns: columnDefs,
      constraints: [],
    };
  }
}

function isEntity() {}
