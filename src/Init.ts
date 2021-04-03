import BinWatch from "./binProxy/BinWatch";
import SrcCache from "./srcProxy/SrcCache";
import SrcWatch from "./srcProxy/SrcWatch";
import WebSocket from "./webSocket/WebSocket";

/**
 * 初始化
 */
export default class Init {
    /**
     * 初始化项目
     */
    public static init(): Promise<void> {
        return new Promise<void>((r, e) => {
            //开启webSocket
            WebSocket.start();
            //开启文件监听
            SrcWatch.start();
            BinWatch.start();
            //开启缓存自动更新计时器
            SrcCache.init();
            //
            r();
        });
    }
}