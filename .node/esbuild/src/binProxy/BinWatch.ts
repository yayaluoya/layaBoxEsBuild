import Config from "src/config/Config";
import { EWebSocketMesType } from "src/webSocket/EWebSocketMesType";
import WebSocket from "src/webSocket/WebSocket";
const chokidar = require('chokidar');
/**
 * bin文件监视
 */
export default class BinWatch {
    /**
     * 开始监视
     */
    public static start() {
        chokidar.watch(Config.bin).on('change', (_url: string) => {
            //取相对路径
            _url = _url.replace(Config.bin, '');
            //发送webSocket消息
            WebSocket.send('bin目录有更新-> ' + _url, EWebSocketMesType.contentUpdate);
        });
    }
}