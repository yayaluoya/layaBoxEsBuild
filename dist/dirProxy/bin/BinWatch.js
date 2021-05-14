"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MainConfig_1 = __importDefault(require("../../config/MainConfig"));
var EWebSocketMesType_1 = require("../../webSocket/EWebSocketMesType");
var WebSocket_1 = __importDefault(require("../../webSocket/WebSocket"));
var chokidar_1 = __importDefault(require("chokidar"));
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
        chokidar_1.default.watch(MainConfig_1.default.config.bin).on('all', function (_e, _url) {
            //发送webSocket消息
            WebSocket_1.default.send("bin\u76EE\u5F55" + _e + "@" + _url, EWebSocketMesType_1.EWebSocketMesType.contentUpdate);
        });
    };
    return BinWatch;
}());
exports.default = BinWatch;
//# sourceMappingURL=BinWatch.js.map