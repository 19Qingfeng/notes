/**
 * 利用ES Build 进行模块第三方依赖扫描
 */
const esbuild = require('esbuild');
const esbuildScanPlugin = require('./esbuildScanPlugin');
const path = require('path');

/**
 * 扫描依赖
 * @param {*} config
 * @returns
 */
async function scanImports(config) {
  const depsImports = {};
  // 扫描依赖插件
  const esPlugin = await esbuildScanPlugin(config, depsImports);
  await esbuild.build({
    absWorkingDir: config.root, // 修改工作路径为config.root
    entryPoints: [
      // path.resolve 传入一个参数 表示的是cwd的绝对路径
      path.resolve('./index.html'), // 寻找当前工作目录下的 index.html 文件作为入口文件
    ],
    bundle: true, // 打包第三方模块
    format: 'esm',
    outfile: 'dist/index.js', // 可有可无
    write: true,
    plugins: [esPlugin],
  });
  return depsImports;
}

module.exports = {
  scanImports,
};
