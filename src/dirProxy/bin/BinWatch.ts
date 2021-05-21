import MainConfig from "../../config/MainConfig";
import { EWebSocketMesType } from "../../webSocket/EWebSocketMesType";
import WebSocket from "../../webSocket/WebSocket";
import fs from 'fs';
import { join } from "path";

/**
 * bin文件监视
 */
export default class BinWatch {
    /**
     * 开始监视
     */
    public static start() {
        fs.watch(MainConfig.config.bin, { recursive: true, }, (_e, _url) => {
            //发送webSocket消息
            WebSocket.send(`bin目录${_e}@${join('/', _url).replace(/\\/g, '/')}`, EWebSocketMesType.contentUpdate);
        });
    }
}