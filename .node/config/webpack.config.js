const path = require('path');
const chalk = require('chalk');

/** ts路径映射插件 */
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Webpackbar = require('webpackbar');
const webpackPlugin = require('../gulpfile/webpack/webpackPlugin');


/** webpack参数 */
const webpackConfig = {
    //开发模式
    mode: "development",
    //入口
    entry: path.resolve(__dirname, '../../src/Main.ts'),
    //输出
    output: {
        path: path.resolve(__dirname, '../../bin/js'),
        filename: 'bundle.js'
    },
    //模块
    module: {
        //定义 loader
        rules: [
            {
                test: /\.tsx?$/,
                use: ['ts-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(md|txt|glsl|vs|fs)$/,
                use: ["raw-loader"],
                exclude: /node_modules/
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', 'glsl', 'md', 'txt', 'vs', 'fs'],
        plugins: [
            //! 这里有个大bug，ts文件结构过深时会使用非相对路径，这个时候就会出错，所以需要这个路径映射插件
            new TsconfigPathsPlugin(),
        ],
    },
    //插件
    plugins: [
        //* 进度栏 */
        // new ProgressBarPlugin(),
        //* 使用交互式可缩放树图可视化webpack输出文件的大小。
        // new BundleAnalyzerPlugin(),
        new Webpackbar(),
        new webpackPlugin(),
    ],
    //源代码调试工具
    devtool: 'inline-source-map',
    // 缓存
    cache: true, // boolean
    // 启用观察
    watch: true, // boolean
    watchOptions: {
        // 限制并行处理模块的数量
        aggregateTimeout: 1000, // in ms
        poll: 500, // 间隔单位 ms
        // 启用轮询观察模式
        // 必须用在不通知更改的文件系统中
        // 即 nfs shares（译者注：Network FileSystem，最大的功能就是可以透過網路，讓不同的機器、不同的作業系統、可以彼此分享個別的檔案 ( share file )）
        ignored: /node_modules/, //忽略时时监听
    },
    // 自动打包运行
    // devServer: {
    //     contentBase: path.resolve(__dirname, "./bin"),
    //     compress: true,
    //     port: 3000,
    //     open: true,
    // },
};

module.exports = webpackConfig;