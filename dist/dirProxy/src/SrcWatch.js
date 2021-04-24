"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainConfig_1 = require("../../config/MainConfig");
const EWebSocketMesType_1 = require("../../webSocket/EWebSocketMesType");
const WebSocket_1 = require("../../webSocket/WebSocket");
const SrcCache_1 = require("./SrcCache");
const chokidar = require('chokidar');
/**
 * Src文件监视
 */
class SrcWatch {
    /**
     * 开始监视
     */
    static start() {
        chokidar.watch(MainConfig_1.default.config.src).on('all', (_e, _url) => {
            //发送webSocket消息
            WebSocket_1.default.send('src代码有更新-> ' + _url, EWebSocketMesType_1.EWebSocketMesType.contentUpdate);
            //更新缓存文件模块
            SrcCache_1.default.updateModule(_url);
        });
    }
}
exports.default = SrcWatch;
//# sourceMappingURL=SrcWatch.js.map