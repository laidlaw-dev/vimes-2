import { evaluate } from '../runtime/index.js';
import { tokenize, TokenStream } from '../lexer/index.js';
import { parseExpression } from '../parser/index.js';

export function replStep(input: string): string {
  const tokens = tokenize(input);
  const ast = parseExpression(new TokenStream(tokens, 0));
  const result = evaluate(ast);
  return result.toString();
}
