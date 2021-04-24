import BinWatch from "./dirProxy/bin/BinWatch";
import SrcCache from "./dirProxy/src/SrcCache";
import SrcWatch from "./dirProxy/src/SrcWatch";
import WebSocket from "./webSocket/WebSocket";

/**
 * 初始化
 */
export default class Init {
    /**
     * 初始化项目
     */
    public static init(): Promise<void> {
        return new Promise<void>(async (r) => {
            //开启webSocket
            await WebSocket.start();
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