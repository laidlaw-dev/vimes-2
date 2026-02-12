export type TokenSource = {
  line: number;
  column: number;
  literal: string;
};

export type TokenKind =
  | { kind: 'int_lit'; value: number }
  | { kind: 'plus' }
  | { kind: 'minus' }
  | { kind: 'star' }
  | { kind: 'slash' }
  | { kind: 'percent' }
  | { kind: 'left_paren' }
  | { kind: 'right_paren' }
  | { kind: 'eof' };

export type Token = TokenKind & TokenSource;
