import { replStep } from './repl-core.js';

describe('replStep', () => {
  it('evalulates a simple expression', () => {
    expect(replStep('1 + 2')).toBe('3');
  });
});
