/**
 * The Statement interface represents a single SQLite statement. This
 * corresponds to the SQLite definition of sql-stmt.
 *
 * https://www.sqlite.org/syntax/sql-stmt.html
 */
export interface Statement {
  type: StatementType;
}

/**
 * An interface that represents a SQLite statement's arguments. Whenever
 * adding support for a new SQLite statement, this should be extended with
 * the statement's arguments.
 */
export interface StatementArguments {}

/** The type of SQL statement. */
export enum StatementType {
  CREATE_TABLE,
  INSERT,
  SELECT,
  DELETE,
}
