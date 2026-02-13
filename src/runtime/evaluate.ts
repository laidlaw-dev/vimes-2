import { ASTExpression } from '../parser/ast-expression.js';

export const evaluate = (expr: ASTExpression): number => {
  switch (expr.kind) {
    case 'int_lit':
      return expr.value;
    case 'prefix': {
      const right = evaluate(expr.right);
      switch (expr.operator) {
        case '-':
          return -right;
        default:
          throw new Error(`Unknown prefix operator: ${expr.operator}`);
      }
    }
    case 'infix': {
      const left = evaluate(expr.left);
      const right = evaluate(expr.right);
      switch (expr.operator) {
        case '+':
          return left + right;
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          return left / right;
        case '%':
          return left % right;
        default:
          throw new Error(`Unknown infix operator: ${expr.operator}`);
      }
    }
  }
};
