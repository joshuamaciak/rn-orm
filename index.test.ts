import {helloWorld} from './index';

test('returns hello world', () => {
  expect(helloWorld()).toBe('Hello, world');
});
