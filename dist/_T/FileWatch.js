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
     * @param _back 回调
     * @param _model 监听模式，原生watch监听和chokidar监听 默认[watch]
     * @param _poll 轮询时间
     */
    FileWatch.startWatch = function (_path, _back, _model, _poll) {
        if (_model === void 0) { _model = 'chokidar'; }
        if (_poll === void 0) { _poll = 500; }
        switch (_model) {
            /** 使用chokidar工具监听 */
            case 'chokidar':
                chokidar_1.default.watch(_path, {
                    /** 默认使用轮询模式，不使用轮询模式的话可能会导致文件夹不能删除 */
                    usePolling: true,
                    /** 轮询时间 */
                    interval: _poll,
                    binaryInterval: _poll,
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