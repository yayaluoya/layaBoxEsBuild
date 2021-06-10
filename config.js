"use strict";
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
/**
 * 文件监听类
 */
class FileWatch {
    /**
     * 初始化
     * @param {boolean} _enable 是否启用 [true]
     * @param {boolean} _usePolling 是否使用轮询，使用轮询的话可能会导致cpu占用过高，不使用轮询的话可能会导致文件夹占用不能删除 [true]
     * @param {number} _interval 轮询间隔时间，_usePolling=true时有效 [100]
     */
    constructor(_enable = null, _usePolling = null, _interval = null) {
        _defineProperty(this, "enable", true);

        _defineProperty(this, "usePolling", true);

        _defineProperty(this, "interval", 100);

        this.enable = _enable !== null && _enable !== void 0 ? _enable : this.enable;
        this.usePolling = _usePolling !== null && _usePolling !== void 0 ? _usePolling : this.usePolling;
        this.interval = _interval !== null && _interval !== void 0 ? _interval : this.interval;
    }
}
/** 
 * 配置数据
 */
module.exports = {
    /** 代理src目录，可以是绝对路径或者相对路径 */
    src: './src/',
    /** 代理bin目录，可以是绝对路径或者相对路径 */
    bin: './bin/',
    /** 文件路径修改，会把 a 匹配的替换成 b */
    filePathModify: [
        {
            a: /^src\//,
            b: '/'
        }
    ],
    /** 代理端口，可以随便指定，为0则自动分配，只要不冲突就行 */
    port: {
        src: 0,
        bin: 0,
    },
    /** src目录文件默认后缀  */
    srcFileDefaultSuffix: 'ts',
    /** 入口文件名，地址相对于src目录 */
    mainTs: 'Main.ts',
    /** 主页， 相对于bin目录 */
    homePage: 'index.html',
    /** 主页脚本， 相对于bin目录 */
    homeJs: 'index.js',
    /** 入口js文件，相对于bin目录 */
    mainJs: 'js/bundle.js',
    /** 自动更新任务时间，分 */
    autoUpdateTaskTime: 3,
    /** 是否打印日志 */
    ifLog: false,
    /** 是否启用webSocket工具 */
    ifOpenWebSocketTool: true,
    /** 是否立即刷新浏览器 */
    ifUpdateNow: true,
    /** 文件监听 */
    fileWatch: {
        /** scr目录的监听配置，enable选项无效 */
        scr: new FileWatch(),
        /** bin目录的监听配置 */
        bin: new FileWatch(true, true, 500),
    },
};