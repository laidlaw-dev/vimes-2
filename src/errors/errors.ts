import { VType } from '@/type-checker/index.js';
import { TokenSource } from './source.js';

export type VError = {
  message: string;
} & TokenSource;

const unexpectedToken = (source: TokenSource): VError => ({
  message: 'Unexpected token',
  ...source,
});

const unexpectedEOF = (source: TokenSource): VError => ({
  message: 'Unexpected end of file',
  ...source,
});

const expectedTokenNotFound = (
  source: TokenSource,
  expected: string
): VError => ({
  message: `Expected '${expected}' not found`,
  ...source,
});

const binaryTypeError = (
  source: TokenSource,
  param1: VType,
  param2: VType
): VError => ({
  message: `Cannot covert type '${param2}' to '${param1}'`,
  ...source,
});

const runtimeDivisionByZero = (source: TokenSource): VError => ({
  message: 'Division by zero',
  ...source,
});

export const Errors = {
  unexpectedToken,
  unexpectedEOF,
  expectedTokenNotFound,
  binaryTypeError,
  runtimeDivisionByZero,
};
