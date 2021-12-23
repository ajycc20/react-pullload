import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const pkg = require('./package.json');

const version = pkg.version;
const license = pkg.license;
const author = pkg.author;

const banner =
  '/**\n' +
  ` * ${pkg.name} v${version}\n` +
  ` * (c) 2021 ${author}\n` +
  ` * Released under the ${license} License.\n` +
  ' */';

const outputConfig = ['umd', 'esm'].map((item) => {
  return {
    file: `lib/index.${item}.js`, // 打包后生产的文件位置，及文件名
    format: item,
    name: 'reactPullLoad', // 包的全局变量名称
    banner,
    globals: {
      react: 'React'
    }
  };
});

module.exports = {
  input: 'src/index.ts',
  external: ['react'],
  output: outputConfig,
  plugins: [
    nodeResolve({
      extensions,
      modulesOnly: true
    }),
    typescript(),
    babel({
      babelHelpers: 'runtime',
      include: 'src/**',
      exclude: 'node_modules/**',
      extensions
    }),
    commonjs(),
    postcss({
      plugins: [require('autoprefixer')],
      minimize: true,
      sourceMap: false,
      extensions: ['.sass', '.scss', '.css']
    }),
    terser()
  ]
};
