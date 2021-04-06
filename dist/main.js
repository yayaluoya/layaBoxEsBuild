"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinProxy_1 = require("./binProxy/BinProxy");
const MainConfig_1 = require("./config/MainConfig");
const Init_1 = require("./Init");
const SrcProxy_1 = require("./srcProxy/SrcProxy");
const chalk = require('chalk');
/**
 * layaboxEsbuild构建实例
 */
class layaboxEsbuild {
    /**
     * 开始构建
     */
    static start(_config) {
        //
        // console.log('配置信息', _config);
        //设置配置数据
        MainConfig_1.default.config = _config;
        //先初始化项目
        Init_1.default.init().then(() => {
            //代理src
            SrcProxy_1.default.start();
            //代理bin
            BinProxy_1.default.start();
            //提示
            console.log(chalk.green('主页地址:'), chalk.magenta('http://localhost:' + MainConfig_1.default.config.port.bin));
        });
    }
}
exports.default = layaboxEsbuild;
//# sourceMappingURL=Main.js.map