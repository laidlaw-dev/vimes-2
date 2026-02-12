export type TokenSource = {
  line: number;
  column: number;
  literal: string;
};

export type Token =
  | ({ kind: 'int_lit'; value: number } & TokenSource)
  | ({ kind: 'plus' } & TokenSource)
  | ({ kind: 'minus' } & TokenSource)
  | ({ kind: 'star' } & TokenSource)
  | ({ kind: 'slash' } & TokenSource)
  | ({ kind: 'percent' } & TokenSource)
  | ({ kind: 'left_paren' } & TokenSource)
  | ({ kind: 'right_paren' } & TokenSource)
  | { kind: 'eof'; literal: '' };
