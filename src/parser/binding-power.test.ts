import { Token } from 'src/lexer/index.js';
import { getBindingPower } from './binding-power.js';

describe('getBindingPower', () => {
  it('returns correct binding power for multiply, divide and modulo', () => {
    expect(getBindingPower({ kind: 'star' } as Token)).toBe(40);
    expect(getBindingPower({ kind: 'slash' } as Token)).toBe(40);
    expect(getBindingPower({ kind: 'percent' } as Token)).toBe(40);
  });
  it('returns correct binding power for add and subtract', () => {
    expect(getBindingPower({ kind: 'plus' } as Token)).toBe(30);
    expect(getBindingPower({ kind: 'minus' } as Token)).toBe(30);
  });
  it('returns correct binding power for unknowns', () => {
    expect(getBindingPower({ kind: '@' } as unknown as Token)).toBe(0);
  });
});
