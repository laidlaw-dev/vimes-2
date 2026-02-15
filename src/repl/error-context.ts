export const errorContext = (
  source: string,
  position: number,
  length: number
) => {
  if (source.trim() === '') {
    return {
      left: '',
      target: '',
      right: '',
    };
  }
  const highlightStart = Math.max(0, Math.min(position, source.length));
  const highlightEnd = Math.min(source.length, Math.max(position + length, 0));

  const leftContext = getLeftContext(source, highlightStart);
  const rightContext = getRightContext(source, highlightEnd);

  return {
    left: leftContext.trimStart(),
    target: source.slice(highlightStart, highlightEnd),
    right: rightContext.trimEnd(),
  };
};

const getLeftContext = (source: string, start: number) => {
  const minLeftContext = 0;
  const maxLeftContext = start - 5;

  let index = start - 1;
  let context = '';

  while (index >= minLeftContext) {
    const char = source[index];
    if (char === '\n') {
      return context;
    }
    if ((char === ' ' || char === '\t') && index <= maxLeftContext) {
      return context;
    }
    context = char + context;
    index--;
  }
  return context;
};

const getRightContext = (source: string, start: number) => {
  const minRightContext = start + 4;
  const maxRightContext = source.length;

  let index = start;
  let context = '';

  while (index < maxRightContext) {
    const char = source[index];
    if (char === '\n') {
      return context;
    }
    if ((char === ' ' || char === '\t') && index >= minRightContext) {
      return context;
    }
    context = context + char;
    index++;
  }
  return context;
};
