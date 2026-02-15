import { TokenSource } from '@/errors/source.js';

export type ASTExpressionCore =
  | { kind: 'int_lit'; value: number }
  | { kind: 'number_lit'; value: number }
  | { kind: 'prefix'; operator: string; right: ASTExpression }
  | {
      kind: 'infix';
      operator: string;
      left: ASTExpression;
      right: ASTExpression;
    };

export type ASTExpression = ASTExpressionCore & TokenSource;
