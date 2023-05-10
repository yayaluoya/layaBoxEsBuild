import MainConfig from '../../config/MainConfig';
import { EWebSocketMesType } from '../../webSocket/EWebSocketMesType';
import WebSocket from '../../webSocket/WebSocket';
import SrcCache from './SrcCache';
import { join } from 'path';
import FileWatch from '../../_T/FileWatch';
/**
 * Src文件监视
 */
export default class SrcWatch {
    /**
     * 开始监视
     */
    public static start() {
        //src目录的监听必须启用
        MainConfig.config.fileWatch.src.enable = true;
        /** 开始监听 */
        FileWatch.startWatch(
            MainConfig.config.src,
            (_e: string, _url: string) => {
                //更新缓存文件模块
                SrcCache.updateModule(_url);
                //取相对路径
                _url = _url.replace(join(MainConfig.config.src, '/'), '/');
                //发送webSocket消息
                WebSocket.send(
                    `src代码${_e}@${join(_url).replace(/\\/g, '/')}✔️`,
                    EWebSocketMesType.contentUpdate,
                );
            },
            'chokidar',
            MainConfig.config.fileWatch.src,
        );
    }
}
