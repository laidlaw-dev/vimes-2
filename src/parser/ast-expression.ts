export type ASTExpression =
  | { kind: 'int_lit'; value: number }
  | { kind: 'prefix'; operator: string; right: ASTExpression }
  | {
      kind: 'infix';
      operator: string;
      left: ASTExpression;
      right: ASTExpression;
    };
