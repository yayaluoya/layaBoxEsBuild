import MainConfig from "../../config/MainConfig";
import { EWebSocketMesType } from "../../webSocket/EWebSocketMesType";
import WebSocket from "../../webSocket/WebSocket";
import SrcCache from "./SrcCache";
import chokidar from "chokidar";
import { join } from "path";
/**
 * Src文件监视
 */
export default class SrcWatch {
    /**
     * 开始监视
     */
    public static start() {
        chokidar.watch(MainConfig.config.src).on('all', (_e, _url: string) => {
            //更新缓存文件模块
            SrcCache.updateModule(_url);
            //取相对路径
            _url = _url.replace(join(MainConfig.config.src, '/'), '/');
            //发送webSocket消息
            WebSocket.send(`src代码${_e}@${join(_url).replace(/\\/g, '/')}✔️`, EWebSocketMesType.contentUpdate);
        });
    }
}