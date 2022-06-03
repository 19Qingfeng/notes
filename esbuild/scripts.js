const demoPlugin = {
  // 插件必备name & setup函数
  name: 'demoPlugin',
  setup(build) {
    // build类似webpack compiler

    build.onResolve({ filter: /^demoFile$/ }, (args) => {
      return {
        path: args.path, // 维持原有path
        // https://esbuild.github.io/plugins/#concepts
        namespace: 'demo', // 赋予新的命名空间，默认为file，表示文件磁盘中。这里重新赋予表示非文件磁盘
      };
    });

    build.onLoad(
      {
        filter: /.*/,
        namespace: 'demo',
      },
      () => {
        return {
          contents: 'export default 100',
          loader: 'js',
        };
      }
    );
  },
};

require('esbuild')
  .build({
    entryPoints: ['./src/index.js'],
    bundle: true,
    outfile: 'dist/out.js',
    plugins: [demoPlugin],
  })
  .catch((args) => console.log(args));
