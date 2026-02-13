// Entry point
import { tokenize, TokenStream } from './lexer/index.js';
import { parseExpression } from './parser/index.js';
import { evaluate } from './runtime/index.js';

const calc = '3 + 4 * (2 - 1)';

const tokens = tokenize(calc);
const ast = parseExpression(new TokenStream(tokens, 0));
const result = evaluate(ast);

console.log(`${calc} = ${result}`);
