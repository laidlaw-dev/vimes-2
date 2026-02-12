import { Token, TokenSource } from './tokens.js';

export const tokenize = (input: string): Token[] => {
  if (input.length === 0) {
    return [];
  }

  const tokens: Token[] = [];
  const tokenizer = new Tokenizer(input);
  while (!tokenizer.isEndOfInput()) {
    const token = tokenizer.nextToken();
    if (token) {
      tokens.push(token);
    }
  }
  return tokens;
};

class Tokenizer {
  private input: string;
  private inputLength: number;
  private position: number = 0;
  private line: number = 0;
  private lineStartIndex: number = 0;

  constructor(input: string) {
    this.input = input;
    this.inputLength = input.length;
  }

  isEndOfInput() {
    return this.position >= this.inputLength;
  }

  nextToken(): Token | undefined {
    const char = this.moveToNextToken();

    // Handle end of input after skipping whitespace
    if (this.isEndOfInput()) {
      return;
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
    const startOfLiteral = this.position > 4 ? this.position - 4 : 0;
    const endOfLiteral = Math.min(this.position + 5, this.inputLength);
    const literal = this.input.slice(startOfLiteral, endOfLiteral);

    throw new Error(
      `Unexpected character "${char}" at line ${this.line + 1}, col ${this.position - this.lineStartIndex + 1}: "${literal}"`
    );
  }

  private readNumber(): Token | undefined {
    if (!this.isDigit(this.input[this.position])) {
      return;
    }
    let lexeme = '';
    const startPosition = this.position;
    let current = startPosition;

    while (!this.isEndOfInput() && this.isDigit(this.input[current])) {
      lexeme += this.input[current];
      current++;
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

  private tokenComplete(token: Token) {
    this.position += token.literal.length;
    return token;
  }

  private moveToNextToken() {
    let current = this.input[this.position];
    while (this.isWhitespace(current)) {
      if (this.isNewline(current)) {
        this.line++;
        this.lineStartIndex = this.position + 1;
      }
      this.position++;
      current = this.input[this.position];
    }
    return current;
  }

  private getTokenSource(
    startingPosition: number,
    literal: string
  ): TokenSource {
    return {
      literal: literal,
      line: this.line + 1,
      column: startingPosition - this.lineStartIndex + 1,
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
}
