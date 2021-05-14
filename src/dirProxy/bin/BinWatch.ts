import MainConfig from "../../config/MainConfig";
import { EWebSocketMesType } from "../../webSocket/EWebSocketMesType";
import WebSocket from "../../webSocket/WebSocket";
import chokidar from "chokidar";

/**
 * bin文件监视
 */
export default class BinWatch {
    /**
     * 开始监视
     */
    public static start() {
        chokidar.watch(MainConfig.config.bin).on('all', (_e, _url: string) => {
            //发送webSocket消息
            WebSocket.send(`bin目录${_e}@` + _url, EWebSocketMesType.contentUpdate);
        });
    }
}