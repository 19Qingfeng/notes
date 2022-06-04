const { normalizePath } = require('./utils');

async function resolveConfig() {
  const root = normalizePath(process.cwd());

  return {
    root,
  };
}

exports.resolveConfig = resolveConfig;
