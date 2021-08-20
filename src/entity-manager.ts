import {Column} from './column';

class EntityInfo {
  id?: string;
  name?: string;
  columns?: Column[];
}

class EntityManager {
  entityInfo: Map<string, EntityInfo>;

  /** Registers the Entity if it isn't already known. Returns the EntityInfo. */
  registerEntity(id: string): EntityInfo {
    const entry = this.entityInfo.get(id) ?? {};
    entry.id = id;
    this.entityInfo.set(id, entry);
    return entry;
  }
}

export const ENTITY_MANAGER = new EntityManager();
