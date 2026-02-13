import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'node18',
  outDir: 'dist',
  shims: false,
  splitting: false,
  bundle: true,
  minify: false,
  skipNodeModulesBundle: true,
});
