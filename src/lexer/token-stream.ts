import { Token } from './tokens.js';

export class TokenStream {
  constructor(
    private tokens: Token[],
    private position: number
  ) {}

  peek(): Token {
    return this.tokens[this.position] ?? { kind: 'eof', literal: '' };
  }

  next(): Token {
    const token = this.peek();
    this.position++;
    return token;
  }

  expect(kind: Token['kind']): Token {
    const token = this.next();
    if (token.kind !== kind) {
      if (token.kind !== 'eof') {
        throw new Error(
          `Expected token of kind "${kind}" but found "${token.literal}" at line ${token.line}, col ${token.column}`
        );
      }
      throw new Error(`Expected token of kind "${kind}" but found end of file`);
    }
    return token;
  }
}
