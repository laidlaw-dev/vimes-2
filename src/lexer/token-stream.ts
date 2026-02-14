import { ok, error, Errors, Result } from '@/errors/index.js';
import { Token, tokenLiterals } from './token.js';

export class TokenStream {
  constructor(
    private tokens: Token[],
    private position: number
  ) {}

  peek(): Token {
    const token = this.tokens[this.position];
    if (token) {
      return token;
    }
    const lastToken = this.tokens[this.tokens.length - 1];
    return {
      kind: 'eof',
      position: lastToken ? lastToken.position + lastToken.length : 0,
      length: 0,
    };
  }

  next(): Token {
    const token = this.peek();
    this.position++;
    return token;
  }

  expect(kind: Token['kind']): Result<Token> {
    const token = this.next();
    if (token.kind !== kind) {
      if (token.kind !== 'eof') {
        return error(Errors.expectedTokenNotFound(token, tokenLiterals[kind]));
      }
      return error(Errors.unexpectedEOF(token));
    }
    return ok(token);
  }
}
