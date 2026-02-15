import { errorPosition } from '@/repl/error-position.js';

describe('errorPosition', () => {
  it('returns the correct 1-based column and line for a single line source', () => {
    const source = 'AAA BBB CCC';
    expect(errorPosition(source, { position: 2, length: 1 })).toEqual({
      fileName: undefined,
      line: 1,
      column: 3,
    });
  });
  it('returns the correct 1-based line and column for a multi-line source', () => {
    const source = 'AAA BBB\nCCC DDD\nEEE FFF';
    expect(errorPosition(source, { position: 2, length: 1 })).toEqual({
      fileName: undefined,
      line: 1,
      column: 3,
    });
    expect(errorPosition(source, { position: 10, length: 1 })).toEqual({
      fileName: undefined,
      line: 2,
      column: 3,
    });
    expect(errorPosition(source, { position: 18, length: 1 })).toEqual({
      fileName: undefined,
      line: 3,
      column: 3,
    });
  });
  it('returns filename if provided', () => {
    const source = 'AAA BBB CCC\nDDD EEE FFF';
    expect(
      errorPosition(source, { position: 2, length: 1, filename: 'test.vms' })
    ).toEqual({
      fileName: 'test.vms',
      line: 1,
      column: 3,
    });
  });
  it('handles positions that are out of bounds to the left', () => {
    const source = 'AAA BBB CCC';
    expect(errorPosition(source, { position: -5, length: 1 })).toEqual({
      fileName: undefined,
      line: undefined,
      column: undefined,
    });
  });
  it('handles positions that are out of bounds to the right', () => {
    const source = 'AAA BBB CCC';
    expect(errorPosition(source, { position: 30, length: 1 })).toEqual({
      fileName: undefined,
      line: undefined,
      column: undefined,
    });
  });
  it('handles empty source', () => {
    const source = '';
    expect(errorPosition(source, { position: 0, length: 1 })).toEqual({
      fileName: undefined,
      line: 1,
      column: 1,
    });
  });
  it('handles empty source when filename is provided', () => {
    const source = '';
    expect(
      errorPosition(source, { position: 0, length: 1, filename: 'test.vms' })
    ).toEqual({
      fileName: 'test.vms',
      line: 1,
      column: 1,
    });
  });
});
