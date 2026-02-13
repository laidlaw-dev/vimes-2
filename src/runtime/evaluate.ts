import { Expression } from '../parser/expression.js';

export const evaluate = (expr: Expression): number => {
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
