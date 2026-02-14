import { PositionalToken, Token, TokenStream } from '../lexer/index.js';
import { getBindingPower } from './binding-power.js';
import { ASTExpression, ASTExpressionCore } from './ast-expression.js';
import { error, Errors, isError, Result } from '@/errors/index.js';

export const parseExpression = (
  stream: TokenStream,
  bindingPower: number = 0
): Result<ASTExpression> => {
  const token = stream.next();
  let left = nud(token, stream);
  if (isError(left)) {
    return left;
  }

  while (bindingPower < getBindingPower(stream.peek())) {
    const nextToken = stream.next();
    left = led(left, nextToken, stream);
    if (isError(left)) {
      return left;
    }
  }
  return left;
};

const nud = (token: Token, stream: TokenStream): Result<ASTExpression> => {
  switch (token.kind) {
    case 'int_lit':
      return createNodeWithPosition(token, {
        kind: 'int_lit',
        value: token.value as number,
      });
    case 'minus': {
      const right = parseExpression(stream, 100);
      if (isError(right)) {
        return right;
      }
      return createNodeWithPosition(token, {
        kind: 'prefix',
        operator: '-',
        right,
      });
    }
    case 'left_paren': {
      const expr = parseExpression(stream, 0);
      if (isError(expr)) {
        return expr;
      }
      const rightParen = stream.expect('right_paren');
      if (isError(rightParen)) {
        return rightParen;
      }
      return expr;
    }
    default: {
      if (token.kind === 'eof') {
        return error(Errors.unexpectedEOF());
      }
      return error(
        Errors.unexpectedToken({
          literal: token.literal,
          line: token.line,
          column: token.column,
        })
      );
    }
  }
};

const led = (
  left: ASTExpression,
  token: Token,
  stream: TokenStream
): Result<ASTExpression> => {
  switch (token.kind) {
    case 'plus': {
      const right = parseExpression(stream, getBindingPower(token));
      if (isError(right)) {
        return right;
      }
      return createNodeWithPosition(token, {
        kind: 'infix',
        operator: '+',
        left,
        right,
      });
    }
    case 'minus': {
      const right = parseExpression(stream, getBindingPower(token));
      if (isError(right)) {
        return right;
      }
      return createNodeWithPosition(token, {
        kind: 'infix',
        operator: '-',
        left,
        right,
      });
    }
    case 'star': {
      const right = parseExpression(stream, getBindingPower(token));
      if (isError(right)) {
        return right;
      }
      return createNodeWithPosition(token, {
        kind: 'infix',
        operator: '*',
        left,
        right,
      });
    }
    case 'slash': {
      const right = parseExpression(stream, getBindingPower(token));
      if (isError(right)) {
        return right;
      }
      return createNodeWithPosition(token, {
        kind: 'infix',
        operator: '/',
        left,
        right,
      });
    }
    case 'percent': {
      const right = parseExpression(stream, getBindingPower(token));
      if (isError(right)) {
        return right;
      }
      return createNodeWithPosition(token, {
        kind: 'infix',
        operator: '%',
        left,
        right,
      });
    }
    default: {
      if (token.kind === 'eof') {
        return error(Errors.unexpectedEOF());
      }
      return error(
        Errors.unexpectedToken({
          literal: token.literal,
          line: token.line,
          column: token.column,
        })
      );
    }
  }
};

const createNodeWithPosition = (
  token: PositionalToken,
  node: ASTExpressionCore
): ASTExpression => {
  return {
    ...node,
    literal: token.literal,
    line: token.line,
    column: token.column,
  };
};
