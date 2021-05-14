"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MainConfig_1 = __importDefault(require("../../config/MainConfig"));
var EWebSocketMesType_1 = require("../../webSocket/EWebSocketMesType");
var WebSocket_1 = __importDefault(require("../../webSocket/WebSocket"));
var SrcCache_1 = __importDefault(require("./SrcCache"));
var URLT_1 = __importDefault(require("../../_T/URLT"));
var chokidar = require('chokidar');
/**
 * Src文件监视
 */
var SrcWatch = /** @class */ (function () {
    function SrcWatch() {
    }
    /**
     * 开始监视
     */
    SrcWatch.start = function () {
        chokidar.watch(MainConfig_1.default.config.src).on('all', function (_e, _url) {
            //更新缓存文件模块
            SrcCache_1.default.updateModule(_url);
            //取相对路径
            _url = _url.replace(URLT_1.default.join(MainConfig_1.default.config.src, '/'), '/');
            //发送webSocket消息
            WebSocket_1.default.send("src\u4EE3\u7801" + _e + "@" + URLT_1.default.join(_url), EWebSocketMesType_1.EWebSocketMesType.contentUpdate);
        });
    };
    return SrcWatch;
}());
exports.default = SrcWatch;
//# sourceMappingURL=SrcWatch.js.map