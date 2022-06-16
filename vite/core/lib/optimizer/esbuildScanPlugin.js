/**
 * esbuild 插件
 * 作用: 分析HTML文件 分析依赖 将依赖加入depsImports
 * @param {*} config
 * @param {*} depsImports
 */

const { createContainer } = require('../server/pluginContainer');
const resolvePlugin = require('../plugins/resolve');
const fs = require('fs');
const { extname } = require('path');

const htmlReg = /(\.html)$/;
const jsReg = /(\.js)$/;
const scriptModuleReg = /<script\s*?type="module" src\="(.+?)"><\/script>/;

async function esbuildScanPlugin(config, depsImports) {
  config.plugins = [resolvePlugin(config)];
  /**
   *
   * @param {*} importee 加载路径
   * @param {*} importer 文件路径
   */
  const resolve = async (importee, importer) => {
    // 创建vite插件容器 TODO: 每次都会创建一个新的插件容器 这不合理
    const container = await createContainer(config);
    // 插件容器调用vite插件(和Rollup实现机制一样)
    return await container.resolveId(importee, importer, config);
  };

  return {
    name: 'vite:dep-scan',
    setup(build) {
      // 加载html文件时的进入的钩子
      build.onResolve({ filter: htmlReg }, async ({ path, importer }) => {
        //  path -> /Users/wanghaoyu/Desktop/vite-test/index.html 绝对路径
        const resolved = await resolve(path, importer);
        // resolved表示处理后的文件在磁盘上的绝对路径
        if (resolved) {
          return {
            path: resolved.id || resolved,
            namespace: 'html', // 将html放入自定义的命名空间
          };
        }
      });
      // 读取html文件内容时的钩子
      build.onLoad({ filter: htmlReg, namespace: 'html' }, ({ path }) => {
        const htmlContext = fs.readFileSync(path).toString();
        const [, scriptSrc] = htmlContext.match(scriptModuleReg);
        // 抽离html中的js脚本路径，交给ESbuild进行打包
        const jsContent = `import ${JSON.stringify(scriptSrc)}`;
        return {
          contents: jsContent,
          loader: 'js',
        };
      });
      // 处理JavaScript文件 引入外部依赖时不一定添加js后缀
      build.onResolve({ filter: /.*/ }, async ({ path, importer }) => {
        //  调用Vite插件
        const resolved = await resolve(path, importer);
        // resolved表示处理后的文件在磁盘上的绝对路径
        const id = resolved.id || resolved;
        if (id && id.indexOf('node_modules') !== -1) {
          // 第三方模块添加依赖
          depsImports[path] = resolved;
          return {
            external: true, // 表示是第三方外部模块 不进行打包
            path: id,
          };
        }
        // 正常返回路径 进入onLoad进行加载模块内容
        return {
          path: id,
        };
      });
      // 读取javascript文件内容时的钩子
      build.onLoad({ filter: jsReg }, ({ path }) => {
        // 正常内容的js文件
        const jsContent = fs.readFileSync(path, {
          encoding: 'utf-8',
        });
        const ext = extname(path).slice(1);
        return {
          contents: jsContent,
          loader: ext,
        };
      });
    },
  };
}

module.exports = esbuildScanPlugin;
