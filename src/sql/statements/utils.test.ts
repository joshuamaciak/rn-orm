import {trimExtraSpaces} from './utils';

describe('trimExtraSpaces', () => {
  it('should remove leading spaces', () => {
    const str = '    test';

    const result = trimExtraSpaces(str);

    expect(result).toBe('test');
  });

  it('should remove trailing spaces', () => {
    const str = 'test    ';

    const result = trimExtraSpaces(str);

    expect(result).toBe('test');
  });

  it('should remove internal duplicate spaces', () => {
    const str = 'te    st';

    const result = trimExtraSpaces(str);

    expect(result).toBe('te st');
  });
});
