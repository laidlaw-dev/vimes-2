import { Token, TokenStream } from '../lexer/index.js';
import { getBindingPower } from './binding-power.js';
import { Expression } from './expression.js';

export const parseExpression = (
  stream: TokenStream,
  bindingPower: number = 0
) => {
  const token = stream.next();
  let left = nud(token, stream);

  while (bindingPower < getBindingPower(stream.peek())) {
    const nextToken = stream.next();
    left = led(left, nextToken, stream);
  }

  return left;
};

const nud = (token: Token, stream: TokenStream): Expression => {
  switch (token.kind) {
    case 'int_lit':
      return { kind: 'int_lit', value: token.value as number };
    case 'minus': {
      const right = parseExpression(stream, 100);
      return { kind: 'prefix', operator: '-', right };
    }
    case 'left_paren': {
      const expr = parseExpression(stream, 0);
      stream.expect('right_paren');
      return expr;
    }
    default: {
      if (token.kind === 'eof') {
        throw new Error(`Unexpected end of file`);
      }
      throw new Error(
        `Unexpected token "${token.literal}" at line ${token.line}, col ${token.column}`
      );
    }
  }
};

const led = (
  left: Expression,
  token: Token,
  stream: TokenStream
): Expression => {
  switch (token.kind) {
    case 'plus': {
      const right = parseExpression(stream, getBindingPower(token));
      return { kind: 'infix', operator: '+', left, right };
    }
    case 'minus': {
      const right = parseExpression(stream, getBindingPower(token));
      return { kind: 'infix', operator: '-', left, right };
    }
    case 'star': {
      const right = parseExpression(stream, getBindingPower(token));
      return { kind: 'infix', operator: '*', left, right };
    }
    case 'slash': {
      const right = parseExpression(stream, getBindingPower(token));
      return { kind: 'infix', operator: '/', left, right };
    }
    case 'percent': {
      const right = parseExpression(stream, getBindingPower(token));
      return { kind: 'infix', operator: '%', left, right };
    }
    default: {
      if (token.kind === 'eof') {
        throw new Error(`Unexpected end of file`);
      }
      throw new Error(
        `Unexpected token "${token.literal}" at line ${token.line}, col ${token.column}`
      );
    }
  }
};
