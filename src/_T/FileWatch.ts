import chokidar from "chokidar";
import { IFileWatch } from "../config/IConfig";

/**
 * 文件监听
 */
export default class FileWatch {
    /**
     * 开始监听
     * @param _path 监听路径
     * @param _back 文件改变后的回调
     * @param _model 监听模式，原生watch监听和chokidar监听 默认[chokidar]
     * @param _option 选项
     */
    public static startWatch(_path: string, _back: (evt: string, _path: string) => void, _model: 'chokidar' = 'chokidar', _option: IFileWatch) {
        // console.log(_path, _option);
        if (!_option.enable) { return; }
        switch (_model) {
            /** 使用chokidar工具监听 */
            case 'chokidar':
                chokidar.watch(_path, {
                    /** 使用轮询的话可能会导致cpu占用过高，不使用轮询模式的话可能会导致文件夹不能删除 */
                    usePolling: _option.usePolling,
                    /** 轮询时间，usePolling为true时有效 */
                    interval: _option.interval,
                }).on('all', (evt, _url: string) => {
                    _back(evt, _url);
                });
                break;
        }
    }
}