import { ok, error, Errors, Result } from '@/errors/index.js';
import { Token, tokenLiterals } from './token.js';

export class TokenStream {
  constructor(
    private tokens: Token[],
    private position: number
  ) {}

  peek(): Token {
    return (
      this.tokens[this.position] ?? {
        kind: 'eof',
        literal: '',
        line: -1,
        column: -1,
      }
    );
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
      return error(Errors.unexpectedEOF());
    }
    return ok(token);
  }
}
