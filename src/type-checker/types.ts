import { ASTExpression } from '@/parser/ast-expression.js';

export type VType = 'int' | 'number';

export interface TypedASTExpression {
  type: VType;
  expression: ASTExpression;
}

export const typeLiterals: Record<VType, string> = {
  int: 'Int',
  number: 'Number',
};
