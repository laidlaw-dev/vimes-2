import { ASTExpression } from '@/parser/ast-expression.js';
import { TypedASTExpression } from './index.js';
import { Errors, error, Result } from '@/errors/index.js';

export const typeCheckExpression = (
  expression: ASTExpression
): Result<TypedASTExpression> => {
  switch (expression.kind) {
    case 'int_lit':
      return {
        type: 'int',
        expression,
      };
    case 'number_lit':
      return {
        type: 'number',
        expression,
      };
    case 'prefix': {
      const rightType = typeCheckExpression(expression.right);
      if ('error' in rightType) {
        return rightType;
      }
      if (expression.operator === '-') {
        return {
          type: rightType.type,
          expression,
        };
      } else {
        return error(Errors.unexpectedToken(expression));
      }
    }
    case 'infix': {
      const leftType = typeCheckExpression(expression.left);
      if ('error' in leftType) {
        return leftType;
      }
      const rightType = typeCheckExpression(expression.right);
      if ('error' in rightType) {
        return rightType;
      }
      if (leftType.type !== rightType.type) {
        return error(
          Errors.binaryTypeError(expression, leftType.type, rightType.type)
        );
      }
      return {
        type: leftType.type,
        expression,
      };
    }
    default:
      return error(Errors.unexpectedToken(expression));
  }
};
