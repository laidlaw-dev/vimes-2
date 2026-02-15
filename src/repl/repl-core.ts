import { styleText } from 'node:util';
import { evaluate } from '../runtime/index.js';
import { tokenize, TokenStream } from '@/lexer/index.js';
import { parseExpression } from '@/parser/index.js';
import { isError } from '@/errors/result.js';
import { TokenSource, VError } from '@/errors/index.js';
import { errorContext } from './error-context.js';
import { errorPosition } from './error-position.js';

export function replStep(input: string): string {
  const tokens = tokenize(input);
  if (isError(tokens)) {
    return getErrorMessage(input, tokens.error);
  }
  const ast = parseExpression(new TokenStream(tokens, 0));
  if (isError(ast)) {
    return getErrorMessage(input, ast.error);
  }
  const result = evaluate(ast);
  if (isError(result)) {
    return getErrorMessage(input, result.error);
  }
  return result.toString();
}

const getErrorMessage = (source: string, error: VError) => {
  const errorMessage = styleText('red', 'Error: ') + error.message;
  const errorContext = getErrorContext(source, error);
  const errorPosition = getErrorPosition(source, error);
  return `${errorMessage}\n${errorContext}\n${errorPosition}`;
};
const getErrorContext = (source: string, error: TokenSource) => {
  const { left, target, right } = errorContext(
    source,
    error.position,
    error.length
  );
  return (
    styleText('dim', left) +
    styleText('bold', target) +
    styleText('dim', right) +
    styleText('reset', '')
  );
};

const getErrorPosition = (source: string, position: TokenSource) => {
  const { line, column, fileName } = errorPosition(source, position);
  const filenameString = fileName ? `${fileName}: ` : '';
  return styleText(
    'dim',
    `${filenameString}[${line !== undefined ? line : '?'}:${column !== undefined ? column : '?'}]`
  );
};
