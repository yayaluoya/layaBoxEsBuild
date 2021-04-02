const path = require('path');
//
/** 配置数据 */
module.exports = {
    //代理目录
    src: path.resolve(__dirname, '../../src/'),
    /** bin目录 */
    bin: path.resolve(__dirname, '../../bin/'),
    //路径替换
    filePathModify: [
        {
            a: /(["'])src\//,
            b: '$1/'
        }
    ],
    /** 代理端口 */
    port: {
        src: 3061,
        bin: 3062,
    },
    /** 主页， 相对于bin目录 */
    homePage: 'index.html',
    /** 主页脚本， 相对于bin目录 */
    homeJs: 'index.js',
    /** 是否打印日志 */
    ifLog: false,
};