const { normalizePath } = require('../utils');
/**
 * 创建vite插件容器
 * @param {*} param0
 * @returns
 */
async function createContainer({ root, plugins }) {
  class PluginContext {
    async resolve(importee, importer = path.join(root, 'index.html')) {
      // 调用容器的resolveId方法
      return await container.resolveId(importee, importer);
    }
  }
  // vite 插件容器
  const container = {
    /**
     * 容器的resolveId方法 依次遍历调用插件中的resolveId方法
     * @param {*} importee 引入的模块路径
     * @param {*} importer 引入该模块的模块路径
     */
    async resolveId(importee, importer) {
      let resolveId = importee;
      const ctx = new PluginContext();
      // 插件容器调用vite插件
      for (let plugin of plugins) {
        if (!plugin.resolveId) container;
        const result = await plugin.resolveId.call(ctx, importee, importer);
        if (result) {
          // 插件的 resolveId 的方法可以返回对象 所以兼容下
          resolveId = result.id || result;
          // 任意一个插件resolveId()方法则返回result即中断
          break;
        }
      }
      return {
        id: normalizePath(resolveId),
      };
    },
  };

  return container;
}

module.exports = {
  createContainer,
};
