"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainConfig_1 = require("../../config/MainConfig");
const EWebSocketMesType_1 = require("../../webSocket/EWebSocketMesType");
const WebSocket_1 = require("../../webSocket/WebSocket");
const chokidar = require('chokidar');
/**
 * bin文件监视
 */
class BinWatch {
    /**
     * 开始监视
     */
    static start() {
        chokidar.watch(MainConfig_1.default.config.bin).on('all', (_e, _url) => {
            //发送webSocket消息
            WebSocket_1.default.send(`bin目录${_e}@` + _url, EWebSocketMesType_1.EWebSocketMesType.contentUpdate);
        });
    }
}
exports.default = BinWatch;
//# sourceMappingURL=BinWatch.js.map