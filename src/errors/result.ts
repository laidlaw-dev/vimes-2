import { VError } from './errors.js';

export type Result<T> =
  | T
  | {
      ok: false;
      error: VError;
    };

export const ok = <T>(value: T): Result<T> => {
  return value;
};

export const error = <T>(error: VError): Result<T> => {
  return { ok: false, error };
};

export const isError = <T>(
  result: Result<T>
): result is { ok: false; error: VError } => {
  return (result as { ok: false; error: VError }).ok === false;
};
