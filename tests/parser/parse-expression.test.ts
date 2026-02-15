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
  it('parses number literals', () => {
    const stream = new TokenStream(
      [{ kind: 'number_lit', value: 42.5 }] as Token[],
      0
    );
    const result = parseExpression(stream);
    expect(result).toMatchObject({ kind: 'number_lit', value: 42.5 });
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
  it('adds position information to the AST nodes in prefix expressions', () => {
    const stream = new TokenStream(
      [
        { kind: 'minus', position: 10, length: 1 },
        { kind: 'int_lit', value: 5, position: 11, length: 1 },
      ] as Token[],
      0
    );
    const result = parseExpression(stream);
    expect(result).toMatchObject({
      kind: 'prefix',
      operator: '-',
      right: { kind: 'int_lit', value: 5, position: 11, length: 1 },
      position: 10,
      length: 1,
    });
  });
  it('adds position information to the AST nodes in infix expressions', () => {
    const stream = new TokenStream(
      [
        { kind: 'int_lit', value: 54, position: 10, length: 2 },
        { kind: 'plus', position: 13, length: 1 },
        { kind: 'int_lit', value: 356, position: 15, length: 3 },
      ],
      0
    );
    const result = parseExpression(stream);
    expect(result).toMatchObject({
      kind: 'infix',
      operator: '+',
      left: { kind: 'int_lit', value: 54, position: 10, length: 2 },
      right: { kind: 'int_lit', value: 356, position: 15, length: 3 },
      position: 10,
      length: 8,
    });
  });
  it('returns an error on unexpected tokens in prefix', () => {
    const stream = new TokenStream(
      [{ kind: 'plus', position: 10, length: 1 }] as Token[],
      0
    );
    const expectedError = Errors.unexpectedToken({
      position: 10,
      length: 1,
    });
    const result = parseExpression(stream);
    expect(isError(result)).toBe(true);
    expect(result).toMatchObject({ error: expectedError });
  });
  it('returns an error on unexpected tokens in infix', () => {
    const stream = new TokenStream(
      [
        { kind: 'int_lit', value: 15, position: 10, length: 2 },
        { kind: 'plus', position: 13, length: 1 },
        { kind: 'percent', position: 15, length: 1 },
      ],
      0
    );
    const expectedError = Errors.unexpectedToken({
      position: 15,
      length: 1,
    });
    const result = parseExpression(stream);
    expect(isError(result)).toBe(true);
    expect(result).toMatchObject({ error: expectedError });
  });
  it('returns an error on unexpected eof in infix', () => {
    const stream = new TokenStream(
      [
        { kind: 'int_lit', value: 5, position: 10, length: 1 },
        { kind: 'plus', position: 12, length: 1 },
      ],
      0
    );
    const expectedError = Errors.unexpectedEOF({ position: 13, length: 0 });
    const result = parseExpression(stream);
    expect(isError(result)).toBe(true);
    expect(result).toMatchObject({ error: expectedError });
  });
  it('returns an error on when right parenthesis is missing', () => {
    const stream = new TokenStream(
      [
        { kind: 'left_paren', position: 10, length: 1 },
        { kind: 'int_lit', value: 5, position: 11, length: 1 },
        { kind: 'plus', position: 13, length: 1 },
        { kind: 'int_lit', value: 3, position: 15, length: 1 },
      ],
      0
    );
    const expectedError = Errors.unexpectedEOF({ position: 16, length: 0 });
    const result = parseExpression(stream);
    expect(isError(result)).toBe(true);
    expect(result).toMatchObject({ error: expectedError });
  });
});
