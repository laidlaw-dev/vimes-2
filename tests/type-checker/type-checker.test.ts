import { Errors } from '@/errors/index.js';
import { isError } from '@/errors/result.js';
import { ASTExpression } from '@/parser/ast-expression.js';
import { typeCheckExpression } from '@/type-checker/index.js';

describe('typeCheckExpression', () => {
  it('type checks int literals', () => {
    const expression = {
      kind: 'int_lit',
      value: 42,
    } as ASTExpression;
    const result = typeCheckExpression(expression);
    expect(result).toMatchObject({
      type: 'int',
      expression,
    });
  });
  it('type checks number literals', () => {
    const expression = {
      kind: 'number_lit',
      value: 42.5,
    } as ASTExpression;
    const result = typeCheckExpression(expression);
    expect(result).toMatchObject({
      type: 'number',
      expression,
    });
  });
  it('type checks prefix expressions for int', () => {
    const expression = {
      kind: 'prefix',
      operator: '-',
      right: { kind: 'int_lit', value: 5 },
    } as ASTExpression;
    const result = typeCheckExpression(expression);
    expect(result).toMatchObject({
      type: 'int',
      expression,
    });
  });
  it('type checks prefix expressions for number', () => {
    const expression = {
      kind: 'prefix',
      operator: '-',
      right: { kind: 'number_lit', value: 5.5 },
    } as ASTExpression;
    const result = typeCheckExpression(expression);
    expect(result).toMatchObject({
      type: 'number',
      expression,
    });
  });
  it('type checks infix expressions for int', () => {
    const expression = {
      kind: 'infix',
      operator: '*',
      left: { kind: 'int_lit', value: 5 },
      right: { kind: 'int_lit', value: 3 },
    } as ASTExpression;
    const result = typeCheckExpression(expression);
    expect(result).toMatchObject({
      type: 'int',
      expression,
    });
  });
  it('type checks infix expressions for number', () => {
    const expression = {
      kind: 'infix',
      operator: '*',
      left: { kind: 'number_lit', value: 5.5 },
      right: { kind: 'number_lit', value: 3.5 },
    } as ASTExpression;
    const result = typeCheckExpression(expression);
    expect(result).toMatchObject({
      type: 'number',
      expression,
    });
  });
  it('returns and error for int and number mix', () => {
    const expression = {
      kind: 'infix',
      operator: '*',
      left: { kind: 'int_lit', value: 5 },
      right: { kind: 'number_lit', value: 3.5 },
      position: 16,
      length: 5,
    } as ASTExpression;

    const expectedError = Errors.binaryTypeError(
      { position: 16, length: 5 },
      'int',
      'number'
    );
    const result = typeCheckExpression(expression);
    expect(isError(result)).toBe(true);
    expect(result).toMatchObject({ error: expectedError });
  });
  it('returns and error for number and int mix', () => {
    const expression = {
      kind: 'infix',
      operator: '*',
      left: { kind: 'number_lit', value: 5.5 },
      right: { kind: 'int_lit', value: 3 },
      position: 16,
      length: 5,
    } as ASTExpression;
    const expectedError = Errors.binaryTypeError(
      { position: 16, length: 5 },
      'number',
      'int'
    );
    const result = typeCheckExpression(expression);
    expect(isError(result)).toBe(true);
    expect(result).toMatchObject({ error: expectedError });
  });
});
