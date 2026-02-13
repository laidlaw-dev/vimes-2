import { TokenSource } from './source.js';

export type VError = {
  message: string;
};

const createPosition = (source: TokenSource) =>
  `[l: ${source.line}, c: ${source.column}]`;

const unexpectedToken = (source: TokenSource): VError => ({
  message: `Unexpected token '${source.literal}' ${createPosition(source)}`,
});

export const Errors = {
  unexpectedToken,
};
