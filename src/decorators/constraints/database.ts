import 'reflect-metadata';
import { Type } from "../decorator-util";

const METADATA_KEY_DATABASE = 'database';

interface DatabaseConfig {
  name: string;
  version: string;
  entities: Type<any>[];
}

export function getDatabaseConfig(target: any): DatabaseConfig {
  return Reflect.getMetadata(METADATA_KEY_DATABASE, target.constructor);
}

export function Database(config: DatabaseConfig): ClassDecorator {
  return target => {
    Reflect.defineMetadata(METADATA_KEY_DATABASE, config, target);
  };
}
