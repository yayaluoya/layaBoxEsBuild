import Config from "src/config/Config";
import URLT from "src/_T/URLT";
import FileCache from "./FileCache";
const chokidar = require('chokidar');
/**
 * 文件监视
 */
export default class FileWatch {
    /**
     * 开始监视
     */
    public static start() {
        chokidar.watch(Config.src).on('change', (_url: string) => {
            //获取相对路径
            _url = _url.replace(Config.src, '');
            //转成浏览器的路径
            if (URLT.sep == '\\') {
                _url = _url.replace(/\\/g, '/');
            }
            //去掉后缀
            _url = _url.replace(/\..*?$/, '');
            //更新缓存文件模块
            FileCache.updateModule(_url);
        });
    }
}