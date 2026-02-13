import readline from 'node:readline';
import { replStep } from './repl-core.js';

export const startRepl = () => {
  console.log('Welcome to the Vimes REPL! Type "exit" to quit.');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'vimes> ',
  });

  rl.prompt();

  rl.on('line', (line : string) => {
    const input = line.trim();
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    try {
      const output = replStep(input);
      console.log(output);
    } catch (error : unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      } else {
        console.error('An unknown error occurred');
      }
    }

    rl.prompt();
  });
}
