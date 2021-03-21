/** @type {import("snowpack").SnowpackUserConfig } */

/** 项目目录 */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: ['@snowpack/plugin-typescript', './.node/gulpfile/snowPack/snowPackPlugin'],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    //打开方式
    open: 'none',
    //端口
    port: 3304,
  },
  buildOptions: {
    /* ... */
  },
  //路径别名
  alias: {
    'src/': './src',
  }
};
