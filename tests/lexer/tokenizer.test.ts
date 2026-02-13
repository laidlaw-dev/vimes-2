import { tokenize } from '../../src/lexer/tokenizer.js';

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
      const result = tokenize('1 + 2 * (3 - 4)');
      expect(result[0]).toMatchObject({
        kind: 'int_lit',
        value: 1,
        literal: '1',
      });
      expect(result[1]).toMatchObject({
        kind: 'plus',
        literal: '+',
      });
      expect(result[2]).toMatchObject({
        kind: 'int_lit',
        value: 2,
        literal: '2',
      });
      expect(result[3]).toMatchObject({
        kind: 'star',
        literal: '*',
      });
      expect(result[4]).toMatchObject({
        kind: 'left_paren',
        literal: '(',
      });
      expect(result[5]).toMatchObject({
        kind: 'int_lit',
        value: 3,
        literal: '3',
      });
      expect(result[6]).toMatchObject({
        kind: 'minus',
        literal: '-',
      });
      expect(result[7]).toMatchObject({
        kind: 'int_lit',
        value: 4,
        literal: '4',
      });
      expect(result[8]).toMatchObject({
        kind: 'right_paren',
        literal: ')',
      });
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
