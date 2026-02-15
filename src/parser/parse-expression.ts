import { Token, TokenStream } from '../lexer/index.js';
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
    case 'number_lit':
      return createNodeWithPosition(token, {
        kind: 'number_lit',
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
        return error(
          Errors.unexpectedEOF({
            position: token.position,
            length: token.length,
          })
        );
      }
      return error(
        Errors.unexpectedToken({
          position: token.position,
          length: token.length,
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
  const startPosition = left.position;
  switch (token.kind) {
    case 'plus': {
      const right = parseExpression(stream, getBindingPower(token));
      if (isError(right)) {
        return right;
      }
      const endPosition = right.position + right.length;
      const length = endPosition - startPosition;
      return {
        kind: 'infix',
        operator: '+',
        left,
        right,
        position: startPosition,
        length,
      };
    }
    case 'minus': {
      const right = parseExpression(stream, getBindingPower(token));
      if (isError(right)) {
        return right;
      }
      const endPosition = right.position + right.length;
      const length = endPosition - left.position;
      return {
        kind: 'infix',
        operator: '-',
        left,
        right,
        position: left.position,
        length,
      };
    }
    case 'star': {
      const right = parseExpression(stream, getBindingPower(token));
      if (isError(right)) {
        return right;
      }
      const endPosition = right.position + right.length;
      const length = endPosition - left.position;
      return {
        kind: 'infix',
        operator: '*',
        left,
        right,
        position: left.position,
        length,
      };
    }
    case 'slash': {
      const right = parseExpression(stream, getBindingPower(token));
      if (isError(right)) {
        return right;
      }
      const endPosition = right.position + right.length;
      const length = endPosition - left.position;
      return {
        kind: 'infix',
        operator: '/',
        left,
        right,
        position: left.position,
        length,
      };
    }
    case 'percent': {
      const right = parseExpression(stream, getBindingPower(token));
      if (isError(right)) {
        return right;
      }
      const endPosition = right.position + right.length;
      const length = endPosition - left.position;
      return {
        kind: 'infix',
        operator: '%',
        left,
        right,
        position: left.position,
        length,
      };
    }
    default: {
      if (token.kind === 'eof') {
        return error(
          Errors.unexpectedEOF({
            position: token.position,
            length: token.length,
          })
        );
      }
      return error(
        Errors.unexpectedToken({
          position: token.position,
          length: token.length,
        })
      );
    }
  }
};

const createNodeWithPosition = (
  token: Token,
  node: ASTExpressionCore
): ASTExpression => {
  return {
    ...node,
    position: token.position,
    length: token.length,
  };
};
