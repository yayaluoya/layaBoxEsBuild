import Config from "src/config/Config";
import { EWebSocketMesType } from "src/webSocket/EWebSocketMesType";
import WebSocket from "src/webSocket/WebSocket";
import URLT from "src/_T/URLT";
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
        chokidar.watch(Config.src).on('change', (_url: string) => {
            //获取相对路径
            _url = _url.replace(Config.src, '');
            //发送webSocket消息
            WebSocket.send('src代码有更新-> ' + _url, EWebSocketMesType.contentUpdate);
            //转成浏览器的路径
            if (URLT.sep == '\\') {
                _url = _url.replace(/\\/g, '/');
            }
            //更新缓存文件模块
            SrcCache.updateModule(_url);
        });
    }
}