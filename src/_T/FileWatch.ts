import chokidar from "chokidar";
import { join } from "path";

/**
 * 文件监听
 */
export default class FileWatch {
    /**
     * 开始监听
     * @param _path 监听路径
     * @param _back 回调
     * @param _model 监听模式，原生watch监听和chokidar监听 默认[watch]
     * @param _poll 轮询时间
     */
    public static startWatch(_path: string, _back: (evt: string, _path: string) => void, _model: 'chokidar' = 'chokidar', _poll: number = 500) {
        switch (_model) {
            /** 使用chokidar工具监听 */
            case 'chokidar':
                chokidar.watch(_path, {
                    /** 默认使用轮询模式，不使用轮询模式的话可能会导致文件夹不能删除 */
                    usePolling: true,
                    /** 轮询时间 */
                    interval: _poll,
                    binaryInterval: _poll,
                }).on('all', (evt, _url: string) => {
                    _back(evt, _url);
                });
                break;
        }
    }
}