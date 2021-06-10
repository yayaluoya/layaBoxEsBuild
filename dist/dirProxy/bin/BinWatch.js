"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MainConfig_1 = __importDefault(require("../../config/MainConfig"));
var EWebSocketMesType_1 = require("../../webSocket/EWebSocketMesType");
var WebSocket_1 = __importDefault(require("../../webSocket/WebSocket"));
var path_1 = require("path");
var FileWatch_1 = __importDefault(require("../../_T/FileWatch"));
/**
 * bin文件监视
 */
var BinWatch = /** @class */ (function () {
    function BinWatch() {
    }
    /**
     * 开始监视
     */
    BinWatch.start = function () {
        /** 开始监听 */
        FileWatch_1.default.startWatch(MainConfig_1.default.config.bin, function (_e, _url) {
            //取相对路径
            _url = _url.replace(path_1.join(MainConfig_1.default.config.bin, '/'), '/');
            //发送webSocket消息
            WebSocket_1.default.send("bin\u76EE\u5F55" + _e + "@" + path_1.join(_url).replace(/\\/g, '/'), EWebSocketMesType_1.EWebSocketMesType.contentUpdate);
        }, 'chokidar', MainConfig_1.default.config.fileWatch.bin);
    };
    return BinWatch;
}());
exports.default = BinWatch;
//# sourceMappingURL=BinWatch.js.map