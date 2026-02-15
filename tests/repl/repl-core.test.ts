import { Errors } from '@/errors/index.js';
import { replStep } from '@/repl/repl-core.js';

describe('replStep', () => {
  it('evalulates a simple expression', () => {
    expect(replStep('1 + 2')).toBe('3');
  });
  it('returns an error message for invalid input token', () => {
    const expectedError = Errors.unexpectedToken({
      position: 0,
      length: 1,
    });
    expect(replStep('@')).toContain(`Error: ${expectedError.message}`);
  });
  it('returns an error message for invalid parsing', () => {
    const expectedError = Errors.unexpectedEOF({ position: 3, length: 0 });
    expect(replStep('1 +')).toContain(`Error: ${expectedError.message}`);
  });
  it('returns an error message for runtime errors', () => {
    const expectedError = Errors.runtimeDivisionByZero({
      position: 4,
      length: 1,
    });
    expect(replStep('1 / 0')).toContain(`Error: ${expectedError.message}`);
  });
});
