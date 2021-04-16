import MainConfig from "../../config/MainConfig";
import { EWebSocketMesType } from "../../webSocket/EWebSocketMesType";
import WebSocket from "../../webSocket/WebSocket";
import URLT from "../../_T/URLT";
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
        chokidar.watch(MainConfig.config.src).on('change', (_url: string) => {
            //获取相对路径
            _url = _url.replace(URLT.join(MainConfig.config.src, '/'), '/');
            //发送webSocket消息
            WebSocket.send('src代码有更新-> ' + _url, EWebSocketMesType.contentUpdate);
            //把路径分隔符转成统一的 / 
            if (URLT.sep == '\\') {
                _url = _url.replace(/\\/g, '/');
            }
            //更新缓存文件模块
            SrcCache.updateModule(_url);
        });
    }
}