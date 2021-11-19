import {Entity, getEntityConfig} from './entity';

describe('@Entity', () => {
  it('should store EntityConfig as metadata', () => {
    @Entity({name: 'test'})
    class Test {}
    const config = getEntityConfig(new Test());
    expect(config).toEqual({name: 'test'});
  });
});
