class Entity {
  name: string;
  columns: Column[];
}

class EntityManager {
  entities: Entity[];
}

export const ENTITY_MANAGER = new EntityManager();
