import { errorContext } from '@/repl/error-context.js';

describe('errorSourceDisplay', () => {
  it('extracts the correct source snippet for a given position and length with padding', () => {
    const { source, position, length } = buildStrings({
      left: 'AA AA ',
      leftPadding: 'B BB ',
      target: 'CCC',
      rightPadding: ' DD D',
      right: ' EE EE',
    });
    expect(errorContext(source, position, length)).toEqual({
      left: 'B BB ',
      target: 'CCC',
      right: ' DD D',
    });
  });
  it('trims whitespace from the extracted source snippet', () => {
    const { source, position, length } = buildStrings({
      left: 'AA AA ',
      leftPadding: 'BBB ',
      target: 'CCC',
      rightPadding: ' DDD',
      right: ' EE EE',
    });
    expect(errorContext(source, position, length)).toEqual({
      left: 'BBB ',
      target: 'CCC',
      right: ' DDD',
    });
  });
  it('terminates on newlines', () => {
    const { source, position, length } = buildStrings({
      left: 'AA AA\n',
      leftPadding: 'BB ',
      target: 'CCC',
      rightPadding: ' DD',
      right: '\nEE EE',
    });
    expect(errorContext(source, position, length)).toEqual({
      left: 'BB ',
      target: 'CCC',
      right: ' DD',
    });
  });
  it('terminates only on newlines and whitespace', () => {
    const { source, position, length } = buildStrings({
      left: 'AA AA ',
      leftPadding: 'BBBBBB ',
      target: 'CCC',
      rightPadding: ' DDDDDD',
      right: '\nEE EE',
    });
    expect(errorContext(source, position, length)).toEqual({
      left: 'BBBBBB ',
      target: 'CCC',
      right: ' DDDDDD',
    });
  });
  it('handles positions near the start of the source', () => {
    const { source, position, length } = buildStrings({
      left: '',
      leftPadding: 'BB ',
      target: 'CCC',
      rightPadding: ' DD D',
      right: ' EE EE',
    });
    expect(errorContext(source, position, length)).toEqual({
      left: 'BB ',
      target: 'CCC',
      right: ' DD D',
    });
  });
  it('handles positions near the end of the source', () => {
    const { source, position, length } = buildStrings({
      left: 'AA AA ',
      leftPadding: 'B BB ',
      target: 'CCC',
      rightPadding: ' DD',
      right: '',
    });
    expect(errorContext(source, position, length)).toEqual({
      left: 'B BB ',
      target: 'CCC',
      right: ' DD',
    });
  });
  it('handles positions that are out of bounds to the left', () => {
    const source = 'AA AA BBB CCC DDD';
    expect(errorContext(source, -5, 3)).toEqual({
      left: '',
      target: '',
      right: 'AA AA',
    });
  });
  it('handles positions that overlap the left', () => {
    const source = 'A AA AA BBB CCC DDD';
    expect(errorContext(source, -2, 3)).toEqual({
      left: '',
      target: 'A',
      right: ' AA AA',
    });
  });
  it('handles positions that are out of bounds to the right', () => {
    const source = 'AAA BBB CCC DD DD';
    expect(errorContext(source, 30, 5)).toEqual({
      left: 'DD DD',
      target: '',
      right: '',
    });
  });
  it('handles positions and length that overlap the right', () => {
    const source = 'AAA BBB DD DD DD';
    expect(errorContext(source, 14, 5)).toEqual({
      left: 'DD DD ',
      target: 'DD',
      right: '',
    });
  });
  it('handles positions that are out of bounds to the right and source is short', () => {
    const source = 'AAA';
    expect(errorContext(source, 30, 5)).toEqual({
      left: 'AAA',
      target: '',
      right: '',
    });
  });
  it('handles empty source', () => {
    const source = '';
    expect(errorContext(source, 0, 5)).toEqual({
      left: '',
      target: '',
      right: '',
    });
  });
  it('handles source with only whitespace', () => {
    const source = '     ';
    expect(errorContext(source, 2, 3)).toEqual({
      left: '',
      target: '',
      right: '',
    });
  });
});

// Helper function to build test strings and calculate position and length
//
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
    position: sources.left.length + sources.leftPadding.length,
    length: sources.target.length,
  };
};
