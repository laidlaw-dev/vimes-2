import { evaluate } from './evaluate.js';

describe('evaluate', () => {
  it('evaluates integer literals', () => {
    expect(evaluate({ kind: 'int_lit', value: 42 })).toBe(42);
  });

  it('evaluates prefix expressions', () => {
    expect(
      evaluate({
        kind: 'prefix',
        operator: '-',
        right: { kind: 'int_lit', value: 5 },
      })
    ).toBe(-5);
  });
  it('evaluates infix multiply expressions', () => {
    expect(
      evaluate({
        kind: 'infix',
        operator: '*',
        left: { kind: 'int_lit', value: 2 },
        right: { kind: 'int_lit', value: 3 },
      })
    ).toBe(6);
  });
  it('evaluates infix divide expressions', () => {
    expect(
      evaluate({
        kind: 'infix',
        operator: '/',
        left: { kind: 'int_lit', value: 6 },
        right: { kind: 'int_lit', value: 3 },
      })
    ).toBe(2);
  });
  it('evaluates infix modulo expressions', () => {
    expect(
      evaluate({
        kind: 'infix',
        operator: '%',
        left: { kind: 'int_lit', value: 5 },
        right: { kind: 'int_lit', value: 3 },
      })
    ).toBe(2);
  });
  it('evaluates infix addition expressions', () => {
    expect(
      evaluate({
        kind: 'infix',
        operator: '+',
        left: { kind: 'int_lit', value: 2 },
        right: { kind: 'int_lit', value: 3 },
      })
    ).toBe(5);
  });
  it('evaluates infix subtraction expressions', () => {
    expect(
      evaluate({
        kind: 'infix',
        operator: '-',
        left: { kind: 'int_lit', value: 5 },
        right: { kind: 'int_lit', value: 2 },
      })
    ).toBe(3);
  });
  it('throws an error for unknown prefix operators', () => {
    expect(() =>
      evaluate({
        kind: 'prefix',
        operator: '@',
        right: { kind: 'int_lit', value: 2 },
      })
    ).toThrow('Unknown prefix operator: @');
  });
  it('throws an error for unknown infix operators', () => {
    expect(() =>
      evaluate({
        kind: 'infix',
        operator: '@',
        left: { kind: 'int_lit', value: 2 },
        right: { kind: 'int_lit', value: 3 },
      })
    ).toThrow('Unknown infix operator: @');
  });
});
