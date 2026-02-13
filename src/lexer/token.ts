import { TokenSource } from '@/errors/index.js';

export type TokenKind =
  | { kind: 'int_lit'; value: number }
  | { kind: 'plus' }
  | { kind: 'minus' }
  | { kind: 'star' }
  | { kind: 'slash' }
  | { kind: 'percent' }
  | { kind: 'left_paren' }
  | { kind: 'right_paren' };

export type PositionalToken = TokenKind & TokenSource;

export type Token = PositionalToken | { kind: 'eof' };
