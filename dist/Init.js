"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinWatch_1 = require("./dirProxy/bin/BinWatch");
const SrcCache_1 = require("./dirProxy/src/SrcCache");
const SrcWatch_1 = require("./dirProxy/src/SrcWatch");
const WebSocket_1 = require("./webSocket/WebSocket");
/**
 * 初始化
 */
class Init {
    /**
     * 初始化项目
     */
    static init() {
        return new Promise((r, e) => {
            //开启webSocket
            WebSocket_1.default.start();
            //开启文件监听
            SrcWatch_1.default.start();
            BinWatch_1.default.start();
            //开启缓存自动更新计时器
            SrcCache_1.default.init();
            //
            r();
        });
    }
}
exports.default = Init;
//# sourceMappingURL=Init.js.map