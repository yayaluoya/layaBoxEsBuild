"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinProxy_1 = require("./dirProxy/bin/BinProxy");
const MainConfig_1 = require("./config/MainConfig");
const Init_1 = require("./Init");
const SrcProxy_1 = require("./dirProxy/src/SrcProxy");
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
            //提示bin目录的主页地址
            console.log(chalk.gray('---->'));
            console.log(chalk.green('本地主页:'), chalk.magenta(BinProxy_1.default.getLocalHomePage()), chalk.gray('更快'));
            console.log(chalk.green('局域网主页:'), chalk.magenta(BinProxy_1.default.getHomePage()));
            console.log(chalk.gray('>'));
            console.log(chalk.gray('局域网主页如果不能访问的话可能是防火墙的原因。'));
        });
    }
}
exports.default = layaboxEsbuild;
//# sourceMappingURL=Main.js.map