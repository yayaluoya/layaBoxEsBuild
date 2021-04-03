import layaboxEsbuild from "../main";
import { EWebSocketMesType } from "../webSocket/EWebSocketMesType";
import WebSocket from "../webSocket/WebSocket";

const chokidar = require('chokidar');
/**
 * bin文件监视
 */
export default class BinWatch {
    /**
     * 开始监视
     */
    public static start() {
        chokidar.watch(layaboxEsbuild.config.bin).on('change', (_url: string) => {
            //取相对路径
            _url = _url.replace(layaboxEsbuild.config.bin, '');
            //发送webSocket消息
            WebSocket.send('bin目录有更新-> ' + _url, EWebSocketMesType.contentUpdate);
        });
    }
}