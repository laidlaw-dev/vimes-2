import { evaluate } from '../runtime/index.js';
import { tokenize, TokenStream } from '../lexer/index.js';
import { parseExpression } from '../parser/index.js';
import { isError } from '@/errors/result.js';

export function replStep(input: string): string {
  const tokens = tokenize(input);
  if (isError(tokens)) {
    return `Error: ${tokens.error.message}`;
  }
  const ast = parseExpression(new TokenStream(tokens, 0));
  if (isError(ast)) {
    return `Error: ${ast.error.message}`;
  }
  const result = evaluate(ast);
  return result.toString();
}
