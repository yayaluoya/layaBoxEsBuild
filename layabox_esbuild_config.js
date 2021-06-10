"use strict";
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
/**
 * 文件监听类
 */
class FileWatch {
    /**
     * 初始化
     * @param {boolean} _enable 是否启用 [true]
     * @param {boolean} _usePolling 是否轮询 [true]
     * @param {number} _interval 轮询时间，_usePolling=true时有效 [100]
     */
    constructor(_enable, _usePolling, _interval) {
        _defineProperty(this, "enable", true);

        _defineProperty(this, "usePolling", true);

        _defineProperty(this, "interval", 100);

        this.enable = _enable !== null && _enable !== void 0 ? _enable : this.enable;
        this.usePolling = _usePolling !== null && _usePolling !== void 0 ? _usePolling : this.usePolling;
        this.interval = _interval !== null && _interval !== void 0 ? _interval : this.interval;
    }
}
/** 配置数据 */
module.exports = {
    /** 代理src目录，可以是绝对路径或者相对路径 */
    src: './test/src/',
    /** 代理bin目录，可以是绝对路径或者相对路径 */
    bin: './test/bin/',
    //
    // src: 'F:/word/LayaMiniGame/src/',
    // bin: 'F:/word/LayaMiniGame/bin/',
};