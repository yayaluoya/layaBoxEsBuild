import watch from "node-watch";
import chokidar from "chokidar";

/**
 * 文件监听
 */
export default class FileWatch {
    /**
     * 开始监听
     * @param _path 监听路径
     * @param _back 回调
     * @param _model 监听模式，原生watch监听和chokidar监听 默认[watch]
     */
    public static startWatch(_path: string, _back: (evt: string, _path: string) => void, _model: 'watch' | 'chokidar' = 'watch') {
        switch (_model) {
            /** 使用包装后的原始node监听 */
            case 'watch':
                watch(_path, { recursive: true }, function (evt, name) {
                    _back(evt, name);
                });
                break;
            /** 使用chokidar工具监听 */
            case 'chokidar':
                chokidar.watch(_path).on('all', (evt, _url: string) => {
                    _back(evt, _url);
                });
                break;
        }
    }
}