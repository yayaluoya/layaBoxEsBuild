const path = require('path');
//
/** 配置数据 */
module.exports = {
    //代理目录
    src: path.resolve(__dirname, '../../src/'),
    //路径替换
    filePathModify: [
        {
            a: /(["'])src\//,
            b: '$1/'
        }
    ],
    //是否压缩代码
    minify: false,
    //主页地址
    home: path.resolve(__dirname, '../../bin/esBuildIndex.html'),
};