import { TokenSource } from '@/errors/source.js';

export const errorPosition = (source: string, position: TokenSource) => {
  if (source === '') {
    return {
      fileName: position.filename,
      line: 1,
      column: 1,
    };
  }

  if (position.position < 0 || position.position > source.length) {
    return {
      fileName: position.filename,
      line: undefined,
      column: undefined,
    };
  }

  let line = 1;
  let column = 1;

  for (let i = 0; i < source.length; i++) {
    if (i === position.position) {
      return {
        fileName: position.filename,
        line,
        column,
      };
    }
    if (source[i] === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
  }

  //  Shouldn't ever reach here because of the earlier bounds check, but just in case:
  return {
    fileName: position.filename,
    line: line,
    column: column,
  };
};
