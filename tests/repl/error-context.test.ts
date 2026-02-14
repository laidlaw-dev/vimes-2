import { errorContext } from '@/repl/error-context.js';

describe('errorSourceDisplay', () => {
  it('extracts the correct source snippet for a given position and length with padding', () => {
    const { source, expected, position, length } = buildStrings({
      left: 'AA AA ',
      leftPadding: 'B BB ',
      target: 'CCC',
      rightPadding: ' DD D',
      right: ' EE EE',
    });
    expect(errorContext(source, position, length)).toBe(expected);
  });
  it('trims whitespace from the extracted source snippet', () => {
    const { source, expected, position, length } = buildStrings({
      left: 'AA AA ',
      leftPadding: 'BBB ',
      target: 'CCC',
      rightPadding: ' DDD',
      right: ' EE EE',
    });
    expect(errorContext(source, position, length)).toBe(expected);
  });
  it('terminates on newlines', () => {
    const { source, expected, position, length } = buildStrings({
      left: 'AA AA\n',
      leftPadding: 'BB ',
      target: 'CCC',
      rightPadding: ' DD',
      right: '\nEE EE',
    });
    expect(errorContext(source, position, length)).toBe(expected);
  });
  it('terminates only on newlines and whitespace', () => {
    const { source, expected, position, length } = buildStrings({
      left: 'AA AA ',
      leftPadding: 'BBBBBB ',
      target: 'CCC',
      rightPadding: ' DDDDDD',
      right: '\nEE EE',
    });
    expect(errorContext(source, position, length)).toBe(expected);
  });
  it('handles positions near the start of the source', () => {
    const { source, expected, position, length } = buildStrings({
      left: '',
      leftPadding: 'BB ',
      target: 'CCC',
      rightPadding: ' DD D',
      right: ' EE EE',
    });
    expect(errorContext(source, position, length)).toBe(expected);
  });
  it('handles positions near the end of the source', () => {
    const { source, expected, position, length } = buildStrings({
      left: 'AA AA ',
      leftPadding: 'B BB ',
      target: 'CCC',
      rightPadding: ' DD',
      right: '',
    });
    expect(errorContext(source, position, length)).toBe(expected);
  });
  it('handles positions that are out of bounds to the left', () => {
    const source = 'AA AA BBB CCC DDD';
    expect(errorContext(source, -5, 3)).toBe('AA AA');
  });
  it('handles positions that overlap the left', () => {
    const source = 'A AA AA BBB CCC DDD';
    expect(errorContext(source, -2, 3)).toBe('A AA AA');
  });
  it('handles positions that are out of bounds to the right', () => {
    const source = 'AAA BBB CCC DD DD';
    expect(errorContext(source, 30, 5)).toBe('DD DD');
  });
  it('handles positions and length that overlap the right', () => {
    const source = 'AAA BBB DD DD DD';
    expect(errorContext(source, 14, 5)).toBe('DD DD DD');
  });
  it('handles positions that are out of bounds to the right and source is short', () => {
    const source = 'AAA';
    expect(errorContext(source, 30, 5)).toBe('AAA');
  });
  it('handles empty source', () => {
    const source = '';
    expect(errorContext(source, 0, 5)).toBe('');
  });
  it('handles source with only whitespace', () => {
    const source = '     ';
    expect(errorContext(source, 2, 3)).toBe('');
  });
});

const buildStrings = (sources: {
  left: string;
  leftPadding: string;
  target: string;
  rightPadding: string;
  right: string;
}) => {
  return {
    source:
      sources.left +
      sources.leftPadding +
      sources.target +
      sources.rightPadding +
      sources.right,
    expected: sources.leftPadding + sources.target + sources.rightPadding,
    position: sources.left.length + sources.leftPadding.length,
    length: sources.target.length,
  };
};
