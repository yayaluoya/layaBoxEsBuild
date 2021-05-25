"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_watch_1 = __importDefault(require("node-watch"));
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
     */
    FileWatch.startWatch = function (_path, _back, _model) {
        if (_model === void 0) { _model = 'watch'; }
        switch (_model) {
            /** 使用包装后的原始node监听 */
            case 'watch':
                node_watch_1.default(_path, { recursive: true }, function (evt, name) {
                    _back(evt, name);
                });
                break;
            /** 使用chokidar工具监听 */
            case 'chokidar':
                chokidar_1.default.watch(_path).on('all', function (evt, _url) {
                    _back(evt, _url);
                });
                break;
        }
    };
    return FileWatch;
}());
exports.default = FileWatch;
//# sourceMappingURL=FileWatch.js.map