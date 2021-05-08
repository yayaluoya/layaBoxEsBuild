import MainConfig from "../../config/MainConfig";
import { EWebSocketMesType } from "../../webSocket/EWebSocketMesType";
import WebSocket from "../../webSocket/WebSocket";
import URLT from "../../_T/URLT";

const chokidar = require('chokidar');
/**
 * bin文件监视
 */
export default class BinWatch {
    /**
     * 开始监视
     */
    public static start() {
        chokidar.watch(MainConfig.config.bin).on('all', (_e, _url: string) => {
            //取相对路径
            _url = _url.replace(URLT.join(MainConfig.config.bin, '/'), '/');
            //发送webSocket消息
            WebSocket.send(`bin目录${_e}@` + _url, EWebSocketMesType.contentUpdate);
        });
    }
}