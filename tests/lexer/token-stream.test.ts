import { Errors } from '@/errors/errors.js';
import { isError } from '@/errors/index.js';
import { Token, TokenStream } from '@/lexer/index.js';

describe('TokenStream', () => {
  describe('peek', () => {
    it('returns the current token without advancing the position', () => {
      const tokens = [
        { kind: 'int_lit', value: '42', literal: '42', line: 1, column: 1 },
        { kind: 'plus', literal: '+', line: 1, column: 4 },
      ] as Token[];
      const stream = new TokenStream(tokens, 0);

      expect(stream.peek()).toEqual(tokens[0]);
      expect(stream.peek()).toEqual(tokens[0]);
    });
    it('returns the EOF token when the stream is empty', () => {
      const stream = new TokenStream([], 0);
      expect(stream.peek()).toMatchObject({
        kind: 'eof',
      });
    });
    it('returns the EOF token when the position is at the end of the stream', () => {
      const tokens = [
        { kind: 'int_lit', value: '42', literal: '42', line: 1, column: 1 },
        { kind: 'plus', literal: '+', line: 1, column: 4 },
      ] as Token[];
      const stream = new TokenStream(tokens, tokens.length);
      expect(stream.peek()).toMatchObject({
        kind: 'eof',
      });
    });
  });
  describe('next', () => {
    it('returns the current token and advances the position', () => {
      const tokens = [
        { kind: 'int_lit', value: '42', literal: '42', line: 1, column: 1 },
        { kind: 'plus', literal: '+', line: 1, column: 4 },
      ] as Token[];
      const stream = new TokenStream(tokens, 0);
      expect(stream.next()).toEqual(tokens[0]);
      expect(stream.next()).toEqual(tokens[1]);
    });
    it('returns eof when next is called past the end of the stream', () => {
      const tokens = [
        { kind: 'int_lit', value: '42', literal: '42', line: 1, column: 1 },
        { kind: 'plus', literal: '+', line: 1, column: 4 },
      ] as Token[];
      const stream = new TokenStream(tokens, 0);
      stream.next();
      stream.next();
      expect(stream.next()).toMatchObject({
        kind: 'eof',
      });
    });
  });
  describe('expect', () => {
    it('returns the current token and advances the position if it matches the expected kind', () => {
      const tokens = [
        { kind: 'int_lit', value: '42', literal: '42', line: 1, column: 1 },
        { kind: 'plus', literal: '+', line: 1, column: 4 },
      ] as Token[];
      const stream = new TokenStream(tokens, 0);
      expect(stream.expect('int_lit')).toEqual(tokens[0]);
      expect(stream.expect('plus')).toEqual(tokens[1]);
    });
    it('returns an error if the current token does not match the expected kind', () => {
      const tokens = [
        { kind: 'int_lit', value: '42', literal: '42', line: 1, column: 1 },
        { kind: 'plus', literal: '+', line: 1, column: 4 },
      ] as Token[];
      const expectedError = Errors.expectedTokenNotFound(
        { literal: '42', line: 1, column: 1 },
        '-'
      );
      const stream = new TokenStream(tokens, 0);

      const result = stream.expect('minus');
      expect(isError(result)).toBe(true);
      expect(result).toMatchObject({ error: expectedError });
    });
    it('returns an error if the current token is eof and does not match the expected kind', () => {
      const tokens = [
        { kind: 'int_lit', value: '42', literal: '42', line: 1, column: 1 },
        { kind: 'plus', literal: '+', line: 1, column: 4 },
      ] as Token[];
      const expectedError = Errors.unexpectedEOF();
      const stream = new TokenStream(tokens, tokens.length);
      const result = stream.expect('minus');
      expect(isError(result)).toBe(true);
      expect(result).toMatchObject({ error: expectedError });
    });
  });
});
