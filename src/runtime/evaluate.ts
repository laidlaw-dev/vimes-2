import { error, Errors, isError, Result } from '@/errors/index.js';
import { ASTExpression } from '../parser/ast-expression.js';

export const evaluate = (expr: ASTExpression): Result<number> => {
  switch (expr.kind) {
    case 'int_lit':
      return expr.value;
    case 'prefix': {
      const right = evaluate(expr.right);
      switch (expr.operator) {
        case '-':
          return -right;
        default:
          return error(
            Errors.unexpectedToken({
              literal: expr.operator,
              line: expr.line,
              column: expr.column,
            })
          );
      }
    }
    case 'infix': {
      const left = evaluate(expr.left);
      if (isError(left)) {
        return left;
      }
      const right = evaluate(expr.right);
      if (isError(right)) {
        return right;
      }
      switch (expr.operator) {
        case '+':
          return left + right;
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/': {
          if (right === 0) {
            return error(Errors.runtimeDivisionByZero(expr));
          }
          return left / right;
        }
        case '%': {
          if (right === 0) {
            return error(Errors.runtimeDivisionByZero(expr));
          }
          return left % right;
        }
        default:
          return error(
            Errors.unexpectedToken({
              literal: expr.operator,
              line: expr.line,
              column: expr.column,
            })
          );
      }
    }
  }
};
