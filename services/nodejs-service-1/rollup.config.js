import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const isProduction = process.env.NODE_ENV === 'production';

const defaultExternal = (id) => {
  return (
    !id.startsWith('@vestico') &&
    !id.startsWith(`\0`) &&
    !id.startsWith(`~`) &&
    !id.startsWith(`.`) &&
    !id.startsWith(process.platform === `win32` ? process.cwd() : `/`)
  );
};

export default {
  input: './dist/server/index.js',
  output: {
    // file: 'dist/bundle.js',
    dir: './dist/rollup',
    format: 'cjs',
    preserveModules: true,
    // exports: 'default',
  },
  external: defaultExternal,
  plugins: [
    resolve({
      rootDir: '../../',
      // moduleDirectories: ['packages'],
      // resolveOnly: [/^@vestico\/.*$/, /widget-api\/.*$/],
      transformMixedEsModules: true,
      extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.jsx', '.tsx'],
    }),
    commonjs({ sourceMap: !isProduction }),
    json(),
    // copy({
    //   targets: [{ src: ['../../node_modules/*', '!**/@vestico/**'], dest: 'dist/rollup/node_modules' }],
    // }),
  ],
};
