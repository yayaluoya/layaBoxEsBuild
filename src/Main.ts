import BinProxy from "./binProxy/BinProxy";
import IConfig from "./config/IConfig";
import Init from "./Init";
import SrcProxy from "./srcProxy/SrcProxy";
const chalk = require('chalk');

/**
 * layaboxEsbuild构建实例
 */
export default class layaboxEsbuild {
    /** 配置数据 */
    public static config: IConfig;
    /**
     * 开始构建
     */
    public static start(_config: IConfig) {
        //
        // console.log('配置信息', _config);
        //
        this.config = _config;
        //先初始化项目
        Init.init().then(() => {
            //代理src
            SrcProxy.start();
            //代理bin
            BinProxy.start();
            //提示
            console.log(chalk.green('主页地址:'), chalk.magenta('http://localhost:' + this.config.port.bin));
        });
    }
}