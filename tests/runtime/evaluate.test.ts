import { Errors, isError } from '@/errors/index.js';
import { ASTExpression } from '@/parser/ast-expression.js';
import { evaluate } from '@/runtime/index.js';

describe('evaluate', () => {
  it('evaluates integer literals', () => {
    expect(evaluate({ kind: 'int_lit', value: 42 } as ASTExpression)).toBe(42);
  });

  it('evaluates prefix expressions', () => {
    expect(
      evaluate({
        kind: 'prefix',
        operator: '-',
        right: { kind: 'int_lit', value: 5 },
      } as ASTExpression)
    ).toBe(-5);
  });
  it('evaluates infix multiply expressions', () => {
    expect(
      evaluate({
        kind: 'infix',
        operator: '*',
        left: { kind: 'int_lit', value: 2 },
        right: { kind: 'int_lit', value: 3 },
      } as ASTExpression)
    ).toBe(6);
  });
  it('evaluates infix divide expressions', () => {
    expect(
      evaluate({
        kind: 'infix',
        operator: '/',
        left: { kind: 'int_lit', value: 6 },
        right: { kind: 'int_lit', value: 3 },
      } as ASTExpression)
    ).toBe(2);
  });
  it('evaluates infix modulo expressions', () => {
    expect(
      evaluate({
        kind: 'infix',
        operator: '%',
        left: { kind: 'int_lit', value: 5 },
        right: { kind: 'int_lit', value: 3 },
      } as ASTExpression)
    ).toBe(2);
  });
  it('evaluates infix addition expressions', () => {
    expect(
      evaluate({
        kind: 'infix',
        operator: '+',
        left: { kind: 'int_lit', value: 2 },
        right: { kind: 'int_lit', value: 3 },
      } as ASTExpression)
    ).toBe(5);
  });
  it('evaluates infix subtraction expressions', () => {
    expect(
      evaluate({
        kind: 'infix',
        operator: '-',
        left: { kind: 'int_lit', value: 5 },
        right: { kind: 'int_lit', value: 2 },
      } as ASTExpression)
    ).toBe(3);
  });
  it('returns an error for unknown prefix operators', () => {
    const expectedError = Errors.unexpectedToken({
      position: 10,
      length: 1,
    });
    const result = evaluate({
      kind: 'prefix',
      operator: '@',
      right: { kind: 'int_lit', value: 2 },
      position: 10,
      length: 1,
    } as ASTExpression);
    expect(isError(result)).toBe(true);
    expect(result).toMatchObject({ error: expectedError });
  });
  it('returns an error for unknown infix operators', () => {
    const expectedError = Errors.unexpectedToken({
      position: 10,
      length: 5,
    });
    const result = evaluate({
      kind: 'infix',
      operator: '@',
      left: { kind: 'int_lit', value: 2 },
      right: { kind: 'int_lit', value: 3 },
      position: 10,
      length: 5,
    } as ASTExpression);
    expect(isError(result)).toBe(true);
    expect(result).toMatchObject({ error: expectedError });
  });
  it('returns an error for division by zero on division', () => {
    const expectedError = Errors.runtimeDivisionByZero({
      position: 10,
      length: 5,
    });

    const result = evaluate({
      kind: 'infix',
      operator: '/',
      left: { kind: 'int_lit', value: 2 },
      right: { kind: 'int_lit', value: 0 },
      position: 10,
      length: 5,
    } as ASTExpression);
    expect(isError(result)).toBe(true);
    expect(result).toMatchObject({ error: expectedError });
  });
  it('returns an error for division by zero on modulo', () => {
    const expectedError = Errors.runtimeDivisionByZero({
      position: 10,
      length: 5,
    });
    const result = evaluate({
      kind: 'infix',
      operator: '%',
      left: { kind: 'int_lit', value: 2 },
      right: { kind: 'int_lit', value: 0 },
      position: 10,
      length: 5,
    } as ASTExpression);
    expect(isError(result)).toBe(true);
    expect(result).toMatchObject({ error: expectedError });
  });
});
