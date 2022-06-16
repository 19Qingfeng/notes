const { scanImports } = require('./scan');
const path = require('path')

/**
 * 分析依赖 服务启动后分析对应依赖文件
 */
async function createOptimizerDepsRun(config) {
  // 扫描到项目内的第三方依赖
  const optimizeDeps = await scanImports(config);
  // vite 预编译的缓存目录
  const { cacheDir } = config 
  // vite 预编译的缓存文件deps
  const depsCacheDir = path.resolve(cacheDir, 'deps')
  // metaData 映射文件
  const metaDataPath = path.join(cacheDir, '_metadata')
  
  const metaData = {
    optimized: {
      
    }
  }


  return optimizeDeps;
  return {
    metaData: 
  }
}

module.exports = {
  createOptimizerDepsRun,
};
