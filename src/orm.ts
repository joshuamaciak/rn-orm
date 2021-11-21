import {PersistenceManager} from './persistence-manager';

class Orm {
  constructor(readonly persistenceMangager: PersistenceManager, models: any[]) {
    // open database
    // if database is not created, create.
    // if additional models are present, check for Migrations
  }

  createDatabase() {
    this.persistenceMangager.initializeDatabase();
  }
}

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
}

enum SqlDataType {
  VARCHAR = 'VARCHAR',
  INTEGER = 'INTEGER',
  BOOL = 'BOOL',
}
