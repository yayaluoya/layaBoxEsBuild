"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chokidar_1 = __importDefault(require("chokidar"));
/**
 * 文件监听
 */
var FileWatch = /** @class */ (function () {
    function FileWatch() {
    }
    /**
     * 开始监听
     * @param _path 监听路径
     * @param _back 文件改变后的回调
     * @param _model 监听模式，原生watch监听和chokidar监听 默认[chokidar]
     * @param _option 选项
     */
    FileWatch.startWatch = function (_path, _back, _model, _option) {
        if (_model === void 0) { _model = 'chokidar'; }
        // console.log(_path, _option);
        if (!_option.enable) {
            return;
        }
        switch (_model) {
            /** 使用chokidar工具监听 */
            case 'chokidar':
                chokidar_1.default.watch(_path, {
                    /** 使用轮询的话可能会导致cpu占用过高，不使用轮询模式的话可能会导致文件夹不能删除 */
                    usePolling: _option.usePolling,
                    /** 轮询时间，usePolling为true时有效 */
                    interval: _option.interval,
                }).on('all', function (evt, _url) {
                    _back(evt, _url);
                });
                break;
        }
    };
    return FileWatch;
}());
exports.default = FileWatch;
//# sourceMappingURL=FileWatch.js.map