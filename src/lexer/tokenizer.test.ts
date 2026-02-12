import { tokenize } from './tokenizer.js';

describe('tokenize', () => {
  describe('ints', () => {
    it('tokenizes a single int literal', () => {
      expect(tokenize('123')).toMatchObject([
        { kind: 'int_lit', value: 123, literal: '123' },
      ]);
    });
    it('tokenizes negative int literals as 2 tokens', () => {
      expect(tokenize('-123')).toMatchObject([
        { kind: 'minus' },
        { kind: 'int_lit', value: 123, literal: '123' },
      ]);
    });
  });
  describe('operators', () => {
    it('tokenizes a plus operator', () => {
      expect(tokenize('+')).toMatchObject([{ kind: 'plus', literal: '+' }]);
    });
    it('tokenizes a minus operator', () => {
      expect(tokenize('-')).toMatchObject([{ kind: 'minus', literal: '-' }]);
    });
    it('tokenizes a star operator', () => {
      expect(tokenize('*')).toMatchObject([{ kind: 'star', literal: '*' }]);
    });
    it('tokenizes a slash operator', () => {
      expect(tokenize('/')).toMatchObject([{ kind: 'slash', literal: '/' }]);
    });
    it('tokenizes a percent operator', () => {
      expect(tokenize('%')).toMatchObject([{ kind: 'percent', literal: '%' }]);
    });
    it('tokenizes a left parenthesis operator', () => {
      expect(tokenize('(')).toMatchObject([
        { kind: 'left_paren', literal: '(' },
      ]);
    });
    it('tokenizes a right parenthesis operator', () => {
      expect(tokenize(')')).toMatchObject([
        { kind: 'right_paren', literal: ')' },
      ]);
    });
    it('tokenizes mix of operators and int literals', () => {
      expect(tokenize('1 + 2 * (3 - 4)')).toEqual([
        { kind: 'int_lit', value: 1, literal: '1', line: 1, column: 1 },
        { kind: 'plus', literal: '+', line: 1, column: 3 },
        { kind: 'int_lit', value: 2, literal: '2', line: 1, column: 5 },
        { kind: 'star', literal: '*', line: 1, column: 7 },
        { kind: 'left_paren', literal: '(', line: 1, column: 9 },
        { kind: 'int_lit', value: 3, literal: '3', line: 1, column: 10 },
        { kind: 'minus', literal: '-', line: 1, column: 12 },
        { kind: 'int_lit', value: 4, literal: '4', line: 1, column: 14 },
        { kind: 'right_paren', literal: ')', line: 1, column: 15 },
      ]);
    });
  });
  describe('adds position information to tokens', () => {
    it('adds line and column information to tokens', () => {
      expect(tokenize('1 + 2\n3 + 4')).toEqual([
        { kind: 'int_lit', value: 1, literal: '1', line: 1, column: 1 },
        { kind: 'plus', literal: '+', line: 1, column: 3 },
        { kind: 'int_lit', value: 2, literal: '2', line: 1, column: 5 },
        { kind: 'int_lit', value: 3, literal: '3', line: 2, column: 1 },
        { kind: 'plus', literal: '+', line: 2, column: 3 },
        { kind: 'int_lit', value: 4, literal: '4', line: 2, column: 5 },
      ]);
    });
  });
  describe('whitespace and end of line', () => {
    it('ignores whitespace', () => {
      expect(tokenize(' 1 + \t2 ')).toEqual([
        { kind: 'int_lit', value: 1, literal: '1', line: 1, column: 2 },
        { kind: 'plus', literal: '+', line: 1, column: 4 },
        { kind: 'int_lit', value: 2, literal: '2', line: 1, column: 7 },
      ]);
    });
    it('ignores end of line characters', () => {
      expect(tokenize('1 + 2\n3 + 4')).toEqual([
        { kind: 'int_lit', value: 1, literal: '1', line: 1, column: 1 },
        { kind: 'plus', literal: '+', line: 1, column: 3 },
        { kind: 'int_lit', value: 2, literal: '2', line: 1, column: 5 },
        { kind: 'int_lit', value: 3, literal: '3', line: 2, column: 1 },
        { kind: 'plus', literal: '+', line: 2, column: 3 },
        { kind: 'int_lit', value: 4, literal: '4', line: 2, column: 5 },
      ]);
    });
    it('ignores whitespace and end of line characters at end of input', () => {
      expect(tokenize('1 + 2\n3 + 4\n \t')).toEqual([
        { kind: 'int_lit', value: 1, literal: '1', line: 1, column: 1 },
        { kind: 'plus', literal: '+', line: 1, column: 3 },
        { kind: 'int_lit', value: 2, literal: '2', line: 1, column: 5 },
        { kind: 'int_lit', value: 3, literal: '3', line: 2, column: 1 },
        { kind: 'plus', literal: '+', line: 2, column: 3 },
        { kind: 'int_lit', value: 4, literal: '4', line: 2, column: 5 },
      ]);
    });
    it('returns empty array if input is empty', () => {
      expect(tokenize('')).toEqual([]);
    });
    it('returns empty array if input is only whitespace and end of line characters', () => {
      expect(tokenize(' \n\t')).toEqual([]);
    });
  });
  describe('errors', () => {
    it('throws an error if it encounters an invalid character', () => {
      // 'Unexpected character "@" at line 2, col 7: "+ 2 @ 3 +"'
      expect(() => tokenize('2 +3\n1 + 2 @ 3 + 4')).toThrow(
        'Unexpected character "@" at line 2, col 7: "+ 2 @ 3 +"'
      );
    });
  });
});
