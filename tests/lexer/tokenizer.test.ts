import { Errors, isError } from '@/errors/index.js';
import { tokenize } from '../../src/lexer/tokenizer.js';
import { Token } from '@/lexer/index.js';

describe('tokenize', () => {
  describe('ints', () => {
    it('tokenizes a single int literal', () => {
      expect(tokenize('123')).toMatchObject([
        { kind: 'int_lit', value: 123, position: 0, length: 3 },
      ]);
    });
    it('tokenizes negative int literals as 2 tokens', () => {
      expect(tokenize('-123')).toMatchObject([
        { kind: 'minus', position: 0, length: 1 },
        { kind: 'int_lit', value: 123, position: 1, length: 3 },
      ]);
    });
  });
  describe('operators', () => {
    it('tokenizes a plus operator', () => {
      expect(tokenize('+')).toMatchObject([
        { kind: 'plus', position: 0, length: 1 },
      ]);
    });
    it('tokenizes a minus operator', () => {
      expect(tokenize('-')).toMatchObject([
        { kind: 'minus', position: 0, length: 1 },
      ]);
    });
    it('tokenizes a star operator', () => {
      expect(tokenize('*')).toMatchObject([
        { kind: 'star', position: 0, length: 1 },
      ]);
    });
    it('tokenizes a slash operator', () => {
      expect(tokenize('/')).toMatchObject([
        { kind: 'slash', position: 0, length: 1 },
      ]);
    });
    it('tokenizes a percent operator', () => {
      expect(tokenize('%')).toMatchObject([
        { kind: 'percent', position: 0, length: 1 },
      ]);
    });
    it('tokenizes a left parenthesis operator', () => {
      expect(tokenize('(')).toMatchObject([
        { kind: 'left_paren', position: 0, length: 1 },
      ]);
    });
    it('tokenizes a right parenthesis operator', () => {
      expect(tokenize(')')).toMatchObject([
        { kind: 'right_paren', position: 0, length: 1 },
      ]);
    });
    it('tokenizes mix of operators and int literals', () => {
      const result = tokenize('1 + 2 * (3 - 4)') as Token[];

      expect(result[0]).toMatchObject({
        kind: 'int_lit',
        value: 1,
      });
      expect(result[1]).toMatchObject({
        kind: 'plus',
      });
      expect(result[2]).toMatchObject({
        kind: 'int_lit',
        value: 2,
      });
      expect(result[3]).toMatchObject({
        kind: 'star',
      });
      expect(result[4]).toMatchObject({
        kind: 'left_paren',
      });
      expect(result[5]).toMatchObject({
        kind: 'int_lit',
        value: 3,
      });
      expect(result[6]).toMatchObject({
        kind: 'minus',
      });
      expect(result[7]).toMatchObject({
        kind: 'int_lit',
        value: 4,
      });
      expect(result[8]).toMatchObject({
        kind: 'right_paren',
      });
    });
  });
  describe('adds position information to tokens', () => {
    it('adds positioninformation to tokens', () => {
      expect(tokenize('1 + 12\n3 + 400')).toEqual([
        { kind: 'int_lit', value: 1, position: 0, length: 1 },
        { kind: 'plus', position: 2, length: 1 },
        { kind: 'int_lit', value: 12, position: 4, length: 2 },
        { kind: 'int_lit', value: 3, position: 7, length: 1 },
        { kind: 'plus', position: 9, length: 1 },
        { kind: 'int_lit', value: 400, position: 11, length: 3 },
      ]);
    });
  });
  describe('whitespace and end of line', () => {
    it('ignores whitespace', () => {
      expect(tokenize(' 1 + \t2 ')).toEqual([
        { kind: 'int_lit', value: 1, position: 1, length: 1 },
        { kind: 'plus', position: 3, length: 1 },
        { kind: 'int_lit', value: 2, position: 6, length: 1 },
      ]);
    });
    it('ignores end of line characters', () => {
      expect(tokenize('1 + 2\n3 + 4')).toEqual([
        { kind: 'int_lit', value: 1, position: 0, length: 1 },
        { kind: 'plus', position: 2, length: 1 },
        { kind: 'int_lit', value: 2, position: 4, length: 1 },
        { kind: 'int_lit', value: 3, position: 6, length: 1 },
        { kind: 'plus', position: 8, length: 1 },
        { kind: 'int_lit', value: 4, position: 10, length: 1 },
      ]);
    });
    it('ignores whitespace and end of line characters at end of input', () => {
      expect(tokenize('1 + 2\n3 + 4\n \t')).toEqual([
        { kind: 'int_lit', value: 1, position: 0, length: 1 },
        { kind: 'plus', position: 2, length: 1 },
        { kind: 'int_lit', value: 2, position: 4, length: 1 },
        { kind: 'int_lit', value: 3, position: 6, length: 1 },
        { kind: 'plus', position: 8, length: 1 },
        { kind: 'int_lit', value: 4, position: 10, length: 1 },
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
    it('returns an error if it encounters an invalid character', () => {
      const expectedError = Errors.unexpectedToken({
        position: 11,
        length: 1,
      });
      const result = tokenize('2 +3\n1 + 2 @ 3 + 4');
      expect(isError(result)).toBe(true);
      expect(result).toMatchObject({ error: expectedError });
    });
  });
});
