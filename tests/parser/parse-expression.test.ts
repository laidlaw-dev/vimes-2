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
  it('throws an error on unexpected tokens', () => {
    const stream = new TokenStream(
      [{ kind: 'plus', literal: '+', line: 1, column: 1 }] as Token[],
      0
    );
    expect(() => parseExpression(stream)).toThrow(
      `Unexpected token "+" at line 1, col 1`
    );
  });
});
