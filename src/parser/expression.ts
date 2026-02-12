export type Expression =
  | { kind: 'int_lit'; value: number }
  | { kind: 'prefix'; operator: string; right: Expression }
  | { kind: 'infix'; operator: string; left: Expression; right: Expression };
