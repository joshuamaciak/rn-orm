import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);

export class PersistenceManager {
  database?: SQLite.SQLiteDatabase;

  /** Opens and returns the database. If it is already opened, just return. */
  async openDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (this.database) {
      return this.database;
    }
    this.database = await SQLite.openDatabase({
      name: 'persistence.db',
      location: 'default',
    });
    return this.database;
  }

  async execute(sql: string, params: any[]): Promise<[SQLite.ResultSet]> {
    const db = await this.openDatabase();
    return await db.executeSql(sql, params);
  }

  async initializeDatabase(instructions: string[]): Promise<void> {
    const db = await this.openDatabase();
    await db.transaction(async tx => {
      for (const instruction of instructions) {
        await tx.executeSql(instruction);
      }
    });
  }
}
