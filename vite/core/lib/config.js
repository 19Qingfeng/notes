const { normalizePath } = require('./utils');
const path = require('path');

async function resolveConfig() {
  const root = normalizePath(process.cwd());
  const cacheDir = normalizePath(path.resolve('node_modules/.vite1'));

  return {
    root,
    cacheDir, // 缓存vite预编译内容
  };
}

exports.resolveConfig = resolveConfig;
