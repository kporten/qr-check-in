// https://rollupjs.org/guide/en/#configuration-files
import typescript from '@wessberg/rollup-plugin-ts';

export default {
  input: './src/app.ts',
  output: [
    {
      entryFileNames: '[name].[format].js',
      dir: './dist',
      format: 'cjs',
    },
    {
      entryFileNames: '[name].[format].js',
      dir: './dist',
      format: 'es',
    },
  ],
  plugins: [
    typescript({
      transpiler: 'babel',
    }),
  ],
};
