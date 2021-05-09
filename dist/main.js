"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BinProxy_1 = require("./dirProxy/bin/BinProxy");
const MainConfig_1 = require("./config/MainConfig");
const Init_1 = require("./Init");
const SrcProxy_1 = require("./dirProxy/src/SrcProxy");
const PackageJson_1 = require("./config/PackageJson");
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
        Init_1.default.init().then(() => __awaiter(this, void 0, void 0, function* () {
            //代理src
            yield SrcProxy_1.default.start();
            //代理bin
            yield BinProxy_1.default.start();
            //提示bin目录的主页地址
            console.log(chalk.gray('---->'));
            console.log(chalk.magenta('本地主页:'), chalk.blue(BinProxy_1.default.getLocalHomePage()), chalk.green('推荐>更快'));
            console.log(chalk.magenta('局域网主页:'), chalk.blue(BinProxy_1.default.getHomePage()));
            console.log(chalk.gray(`> ${PackageJson_1.default.name}@${PackageJson_1.default.version}`));
            console.log(chalk.gray('执行 layabox-esbuild -h 查看帮助或解决bug'));
            console.log(chalk.gray('...'));
        }));
    }
}
exports.default = layaboxEsbuild;
//# sourceMappingURL=Main.js.map