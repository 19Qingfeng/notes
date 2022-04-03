const { build } = require('esbuild');
const { resolve } = require('path');
const argv = require('minimist')(process.argv.slice(2));

const target = argv['_'];
const format = argv['f'];

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));

const outputFormat = format.startsWith('global')
  ? 'iife'
  : format.startsWith('cjs')
  ? 'cjs'
  : 'esm';

const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${outputFormat}.js`
);

build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true, // 将所有依赖打包进入
  sourcemap: true, // 是否需要sourceMap
  format: outputFormat, // 输出文件格式 IIFE、CJS、ESM
  globalName: pkg.buildOptions?.name, // 打包后全局注册的变量名 IIFE下生效
  platform: outputFormat === 'cjs' ? 'node' : 'browser', // 平台
  watch: {
    onRebuild(error) {
      if (error) {
        console.log(error, 'error');
      }
      console.log(`reBuild by ${Date.now()}`);
    },
  },
}).then(() => {
  console.log('start esBuild');
});
