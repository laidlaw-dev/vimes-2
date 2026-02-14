import { Errors, isError } from '@/errors/index.js';
import { TokenStream, Token } from '../../src/lexer/index.js';
import { parseExpression } from '../../src/parser/parse-expression.js';

describe('parseExpression', () => {
  it('parses integer literals', () => {
    const stream = new TokenStream(
      [{ kind: 'int_lit', value: 42 }] as Token[],
      0
    );
    const result = parseExpression(stream);
    expect(result).toMatchObject({ kind: 'int_lit', value: 42 });
  });
  it('parses prefix expressions', () => {
    const stream = new TokenStream(
      [{ kind: 'minus' }, { kind: 'int_lit', value: 5 }] as Token[],
      0
    );
    const result = parseExpression(stream);
    expect(result).toMatchObject({
      kind: 'prefix',
      operator: '-',
      right: { kind: 'int_lit', value: 5 },
    });
  });
  it('parses infix expressions with star token', () => {
    const stream = new TokenStream(
      [
        { kind: 'int_lit', value: 5 },
        { kind: 'star' },
        { kind: 'int_lit', value: 3 },
      ] as Token[],
      0
    );
    const result = parseExpression(stream);
    expect(result).toMatchObject({
      kind: 'infix',
      operator: '*',
      left: { kind: 'int_lit', value: 5 },
      right: { kind: 'int_lit', value: 3 },
    });
  });
  it('parses infix expressions with slash token', () => {
    const stream = new TokenStream(
      [
        { kind: 'int_lit', value: 5 },
        { kind: 'slash' },
        { kind: 'int_lit', value: 3 },
      ] as Token[],
      0
    );
    const result = parseExpression(stream);
    expect(result).toMatchObject({
      kind: 'infix',
      operator: '/',
      left: { kind: 'int_lit', value: 5 },
      right: { kind: 'int_lit', value: 3 },
    });
  });
  it('parses infix expressions with percent token', () => {
    const stream = new TokenStream(
      [
        { kind: 'int_lit', value: 5 },
        { kind: 'percent' },
        { kind: 'int_lit', value: 3 },
      ] as Token[],
      0
    );
    const result = parseExpression(stream);
    expect(result).toMatchObject({
      kind: 'infix',
      operator: '%',
      left: { kind: 'int_lit', value: 5 },
      right: { kind: 'int_lit', value: 3 },
    });
  });
  it('parses infix expressions with plus token', () => {
    const stream = new TokenStream(
      [
        { kind: 'int_lit', value: 5 },
        { kind: 'plus' },
        { kind: 'int_lit', value: 3 },
      ] as Token[],
      0
    );
    const result = parseExpression(stream);
    expect(result).toMatchObject({
      kind: 'infix',
      operator: '+',
      left: { kind: 'int_lit', value: 5 },
      right: { kind: 'int_lit', value: 3 },
    });
  });
  it('parses infix expressions with minus token', () => {
    const stream = new TokenStream(
      [
        { kind: 'int_lit', value: 5 },
        { kind: 'minus' },
        { kind: 'int_lit', value: 3 },
      ] as Token[],
      0
    );
    const result = parseExpression(stream);
    expect(result).toMatchObject({
      kind: 'infix',
      operator: '-',
      left: { kind: 'int_lit', value: 5 },
      right: { kind: 'int_lit', value: 3 },
    });
  });
  it('parses infix expressions with parentheses', () => {
    const stream = new TokenStream(
      [
        { kind: 'left_paren' },
        { kind: 'int_lit', value: 5 },
        { kind: 'plus' },
        { kind: 'int_lit', value: 3 },
        { kind: 'right_paren' },
        { kind: 'star' },
        { kind: 'int_lit', value: 4 },
      ] as Token[],
      0
    );
    const result = parseExpression(stream);
    expect(result).toMatchObject({
      kind: 'infix',
      operator: '*',
      left: {
        kind: 'infix',
        operator: '+',
        left: { kind: 'int_lit', value: 5 },
        right: { kind: 'int_lit', value: 3 },
      },
      right: { kind: 'int_lit', value: 4 },
    });
  });
  it('parses infix expressions with unary operators', () => {
    const stream = new TokenStream(
      [
        { kind: 'minus' },
        { kind: 'int_lit', value: 5 },
        { kind: 'star' },
        { kind: 'int_lit', value: 3 },
      ] as Token[],
      0
    );
    const result = parseExpression(stream);
    expect(result).toMatchObject({
      kind: 'infix',
      operator: '*',
      left: {
        kind: 'prefix',
        operator: '-',
        right: { kind: 'int_lit', value: 5 },
      },
      right: { kind: 'int_lit', value: 3 },
    });
  });
  it('add position information to the AST nodes', () => {
    const stream = new TokenStream(
      [
        { kind: 'int_lit', literal: '5', value: 5, line: 1, column: 1 },
        { kind: 'plus', literal: '+', line: 1, column: 3 },
        { kind: 'int_lit', literal: '3', value: 3, line: 2, column: 5 },
      ],
      0
    );
    const result = parseExpression(stream);
    expect(result).toMatchObject({
      kind: 'infix',
      operator: '+',
      left: { kind: 'int_lit', value: 5, literal: '5', line: 1, column: 1 },
      right: { kind: 'int_lit', value: 3, literal: '3', line: 2, column: 5 },
      line: 1,
      column: 3,
    });
  });
  it('returns an error on unexpected tokens in prefix', () => {
    const stream = new TokenStream(
      [{ kind: 'plus', literal: '+', line: 1, column: 1 }],
      0
    );
    const expectedError = Errors.unexpectedToken({
      literal: '+',
      line: 1,
      column: 1,
    });
    const result = parseExpression(stream);
    expect(isError(result)).toBe(true);
    expect(result).toMatchObject({ error: expectedError });
  });
  it('returns an error on unexpected tokens in infix', () => {
    const stream = new TokenStream(
      [
        { kind: 'int_lit', value: 5, literal: '5', line: 1, column: 1 },
        { kind: 'plus', literal: '+', line: 1, column: 3 },
        { kind: 'percent', literal: '%', line: 1, column: 5 },
      ],
      0
    );
    const expectedError = Errors.unexpectedToken({
      literal: '%',
      line: 1,
      column: 5,
    });
    const result = parseExpression(stream);
    expect(isError(result)).toBe(true);
    expect(result).toMatchObject({ error: expectedError });
  });
  it('returns an error on unexpected eof in infix', () => {
    const stream = new TokenStream(
      [
        { kind: 'int_lit', value: 5, literal: '5', line: 1, column: 1 },
        { kind: 'plus', literal: '+', line: 1, column: 3 },
      ],
      0
    );
    const expectedError = Errors.unexpectedEOF();
    const result = parseExpression(stream);
    expect(isError(result)).toBe(true);
    expect(result).toMatchObject({ error: expectedError });
  });
  it('returns an error on when right parenthesis is missing', () => {
    const stream = new TokenStream(
      [
        { kind: 'left_paren', literal: '(', line: 1, column: 1 },
        { kind: 'int_lit', value: 5, literal: '5', line: 1, column: 2 },
        { kind: 'plus', literal: '+', line: 1, column: 4 },
        { kind: 'int_lit', value: 3, literal: '3', line: 1, column: 6 },
      ],
      0
    );
    const expectedError = Errors.unexpectedEOF();
    const result = parseExpression(stream);
    expect(isError(result)).toBe(true);
    expect(result).toMatchObject({ error: expectedError });
  });
});
