import {
  error,
  Errors,
  isError,
  ok,
  Result,
  TokenSource,
} from '@/errors/index.js';
import { Token } from './token.js';

export const tokenize = (input: string): Result<Token[]> => {
  if (input.length === 0) {
    return ok([]);
  }

  const tokens: Token[] = [];
  const tokenizer = new Tokenizer(input);
  while (!tokenizer.isEndOfInput()) {
    const result = tokenizer.nextToken();
    if (isError(result)) {
      return error(result.error);
    }
    if (result.kind !== 'eof') {
      tokens.push(result);
    }
  }

  return ok(tokens);
};

class Tokenizer {
  private input: string;
  private inputLength: number;
  private position: number = 0;

  constructor(input: string) {
    this.input = input;
    this.inputLength = input.length;
  }

  isEndOfInput() {
    return this.position >= this.inputLength;
  }

  nextToken(): Result<Token> {
    const char = this.moveToNextToken();

    // Handle end of input after skipping whitespace
    if (this.isEndOfInput()) {
      return this.tokenComplete({
        kind: 'eof',
        ...this.getTokenSource(this.position),
      });
    }

    // Try to read a number token first
    const numberToken = this.readNumber();
    if (numberToken) {
      return this.tokenComplete(numberToken);
    }

    // Try to read an operator token
    const operatorToken = this.readOperator(char);
    if (operatorToken) {
      return this.tokenComplete(operatorToken);
    }

    // If we get here, it's an unexpected character
    return error(
      Errors.unexpectedToken({
        position: this.position,
        length: 1,
      })
    );
  }

  private readNumber(): Token | undefined {
    if (!this.isNumberStart(this.input[this.position])) {
      return undefined;
    }
    let lexeme = '';
    const startPosition = this.position;
    let current = startPosition;

    while (!this.isEndOfInput() && this.isNumber(this.input[current])) {
      lexeme += this.input[current];
      current++;
    }

    if (lexeme.includes('.') || lexeme.includes('e') || lexeme.includes('E')) {
      return {
        kind: 'number_lit',
        value: parseFloat(lexeme),
        ...this.getTokenSource(startPosition, lexeme),
      };
    }

    return {
      kind: 'int_lit',
      value: parseInt(lexeme, 10),
      ...this.getTokenSource(startPosition, lexeme),
    };
  }

  private readOperator(char: string): Token | undefined {
    if (char === '+') {
      return {
        kind: 'plus',
        ...this.getTokenSource(this.position, char),
      };
    }
    if (char === '-') {
      return {
        kind: 'minus',
        ...this.getTokenSource(this.position, char),
      };
    }
    if (char === '*') {
      return {
        kind: 'star',
        ...this.getTokenSource(this.position, char),
      };
    }
    if (char === '/') {
      return {
        kind: 'slash',
        ...this.getTokenSource(this.position, char),
      };
    }
    if (char === '%') {
      return {
        kind: 'percent',
        ...this.getTokenSource(this.position, char),
      };
    }
    if (char === '(') {
      return {
        kind: 'left_paren',
        ...this.getTokenSource(this.position, char),
      };
    }
    if (char === ')') {
      return {
        kind: 'right_paren',
        ...this.getTokenSource(this.position, char),
      };
    }
  }

  private tokenComplete(token: Token): Result<Token> {
    this.position += token.length;
    return ok(token);
  }

  private moveToNextToken() {
    let current = this.input[this.position];
    while (this.isWhitespace(current)) {
      this.position++;
      current = this.input[this.position];
    }
    return current;
  }

  private getTokenSource(
    startingPosition: number,
    literal?: string
  ): TokenSource {
    return {
      position: startingPosition,
      length: literal ? literal.length : 0,
    };
  }

  private isWhitespace(char: string) {
    return char === ' ' || char === '\t' || char === '\n' || char === '\r';
  }
  private isNewline(char: string) {
    return char === '\n' || char === '\r';
  }
  private isDigit(char: string) {
    return char >= '0' && char <= '9';
  }
  private isNumberStart(char: string) {
    return this.isDigit(char) || char === '.';
  }
  private isNumber(char: string) {
    return this.isDigit(char) || char === '.' || char === 'e' || char === 'E';
  }
}
