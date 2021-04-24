import MainConfig from "../../config/MainConfig";
import { EWebSocketMesType } from "../../webSocket/EWebSocketMesType";
import WebSocket from "../../webSocket/WebSocket";
import SrcCache from "./SrcCache";
const chokidar = require('chokidar');
/**
 * Src文件监视
 */
export default class SrcWatch {
    /**
     * 开始监视
     */
    public static start() {
        chokidar.watch(MainConfig.config.src).on('all', (_e, _url: string) => {
            //发送webSocket消息
            WebSocket.send('src代码有更新-> ' + _url, EWebSocketMesType.contentUpdate);
            //更新缓存文件模块
            SrcCache.updateModule(_url);
        });
    }
}