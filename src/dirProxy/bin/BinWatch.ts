import MainConfig from "../../config/MainConfig";
import { EWebSocketMesType } from "../../webSocket/EWebSocketMesType";
import WebSocket from "../../webSocket/WebSocket";
import { join } from "path";
import FileWatch from "../../_T/FileWatch";

/**
 * bin文件监视
 */
export default class BinWatch {
    /**
     * 开始监视
     */
    public static start() {
        /** 开始监听 */
        FileWatch.startWatch(MainConfig.config.bin, (_e, _url) => {
            //取相对路径
            _url = _url.replace(join(MainConfig.config.bin, '/'), '/');
            //发送webSocket消息
            WebSocket.send(`bin目录${_e}@${join(_url).replace(/\\/g, '/')}`, EWebSocketMesType.contentUpdate);
        }, 'chokidar', MainConfig.config.fileWatch.bin);
    }
}