const path = require('path');
const fs = require('fs');
const resolve = require('resolve');

// vite 插件 分析路径，将绝对、相对、第三方模块路径转化为资盘上的绝对路径
function resolvePlugin(config) {
  return {
    name: 'vite:resolve',
    resolveId(importee, importer) {
      // 入口文件 资盘上的绝对路径
      if (path.isAbsolute(importee) && !importer) {
        return {
          id: importee,
        };
      }
      // 非入口文件 绝对路径：相对于项目pwd的绝对路径
      if (path.isAbsolute(importee)) {
        return {
          id: path.resolve(config.root, importee.slice(1)),
        };
      }
      // 相对路径
      if (importee.startsWith('.')) {
        const baseDir = path.dirname(importer);
        const fsPath = path.resolve(baseDir, importee);
        return {
          id: fsPath,
        };
      }
      // 第三方模块
      const res = tryNodeResolve(importee, importer, config);
      if (res) {
        return res;
      }
    },
  };
}

/**
 * 寻找第三方包的绝对路径
 * 这里简单寻找pck中的module字段
 * 修改路径返回给esbuild进行打包
 * @param {*} importee
 * @param {*} importer
 * @param {*} config
 */
function tryNodeResolve(importee, importer, config) {
  debugger;
  const pckPath = resolve.sync(`${importee}/package.json`, {
    basedir: config.root,
  });
  const pckDir = path.dirname(pckPath);
  const entryFile = JSON.parse(fs.readFileSync(pckPath).toString()).module;

  return {
    id: path.join(pckDir, entryFile),
  };
}

module.exports = resolvePlugin;
