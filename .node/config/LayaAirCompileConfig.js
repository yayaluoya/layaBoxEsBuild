const path = require('path');

/** 根路径 */
const rootURL = path.resolve(__dirname, '../../');

/**
 * LayaAir编译配置
 */
let LayaAirCompileConfig = {
    /** 名字 */
    itemName: 'LayaMiniGame',

    /** */
    livereload: true,

    /** 端口，一个随机的端口 */
    // port: Math.floor(Math.random() * (9999 - 1000)) + 1000,

    /** 端口，固定端口 */
    port: 3001,

    /** 默认路径 */
    root: rootURL,

    /** 默认首页 */
    indexPage: rootURL + '/bin/index.html',

    /** 是否自动刷新 */
    ifAutoUpdate: true,

    /** 是否自动唤醒编译 */
    ifAutoAwakeCompile: false,

    /** 自动唤醒编译时间 */
    autoAwakeCompileTime: 10 * 60 * 1000,

    /** 监听文件列表 */
    watchFileList: ['src/**'],

    /** 监听文件延迟时间 */
    watchFileDelay: 3000,

    //主页
    homepage: '/bin/index.html',
}

//导出
module.exports = LayaAirCompileConfig;