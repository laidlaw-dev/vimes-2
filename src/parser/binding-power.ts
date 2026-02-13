import { Token } from '../lexer/index.js';

export const getBindingPower = (token: Token): number => {
  switch (token.kind) {
    case 'star':
    case 'slash':
    case 'percent':
      return 40;
    case 'plus':
    case 'minus':
      return 30;
    default:
      return 0;
  }
};
