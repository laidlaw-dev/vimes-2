import { TokenSource } from '@/errors/index.js';

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

export const tokenLiterals = {
  int_lit: '[int]',
  plus: '+',
  minus: '-',
  star: '*',
  slash: '/',
  percent: '%',
  left_paren: '(',
  right_paren: ')',
  eof: 'EOF',
};
