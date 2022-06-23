"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MainConfig_1 = __importDefault(require("../../config/MainConfig"));
const EWebSocketMesType_1 = require("../../webSocket/EWebSocketMesType");
const WebSocket_1 = __importDefault(require("../../webSocket/WebSocket"));
const SrcCache_1 = __importDefault(require("./SrcCache"));
const path_1 = require("path");
const FileWatch_1 = __importDefault(require("../../_T/FileWatch"));
/**
 * Src文件监视
 */
class SrcWatch {
    /**
     * 开始监视
     */
    static start() {
        //src目录的监听必须启用
        MainConfig_1.default.config.fileWatch.src.enable = true;
        /** 开始监听 */
        FileWatch_1.default.startWatch(MainConfig_1.default.config.src, (_e, _url) => {
            //更新缓存文件模块
            SrcCache_1.default.updateModule(_url);
            //取相对路径
            _url = _url.replace(path_1.join(MainConfig_1.default.config.src, '/'), '/');
            //发送webSocket消息
            WebSocket_1.default.send(`src代码${_e}@${path_1.join(_url).replace(/\\/g, '/')}✔️`, EWebSocketMesType_1.EWebSocketMesType.contentUpdate);
        }, 'chokidar', MainConfig_1.default.config.fileWatch.src);
    }
}
exports.default = SrcWatch;
//# sourceMappingURL=SrcWatch.js.map