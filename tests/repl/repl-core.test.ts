import { Errors } from '@/errors/index.js';
import { replStep } from '@/repl/repl-core.js';

describe('replStep', () => {
  it('evalulates a simple expression', () => {
    expect(replStep('1 + 2')).toBe('3');
  });
  it('returns an error message for invalid input token', () => {
    const expectedError = Errors.unexpectedToken({
      literal: '@',
      line: 1,
      column: 1,
    });
    expect(replStep('@')).toBe(`Error: ${expectedError.message}`);
  });
  it('returns an error message for invalid parsing', () => {
    const expectedError = Errors.unexpectedEOF();
    expect(replStep('1 +')).toBe(`Error: ${expectedError.message}`);
  });
});
