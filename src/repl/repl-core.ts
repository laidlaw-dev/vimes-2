import { evaluate } from '../runtime/index.js';
import { tokenize, TokenStream } from '../lexer/index.js';
import { parseExpression } from '../parser/index.js';
import { isError } from '@/errors/result.js';
import { VError } from '@/errors/index.js';
import { errorContext } from './error-context.js';

export function replStep(input: string): string {
  const tokens = tokenize(input);
  if (isError(tokens)) {
    return getErrorContext(input, tokens.error);
  }
  const ast = parseExpression(new TokenStream(tokens, 0));
  if (isError(ast)) {
    return getErrorContext(input, ast.error);
  }
  const result = evaluate(ast);
  if (isError(result)) {
    return getErrorContext(input, result.error);
  }
  return result.toString();
}

const getErrorContext = (source: string, error: VError) => {
  return (
    'Error: ' +
    error.message +
    '\n' +
    errorContext(source, error.position, error.length)
  );
};
