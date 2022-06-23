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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BinProxy_1 = __importDefault(require("./dirProxy/bin/BinProxy"));
const MainConfig_1 = __importDefault(require("./config/MainConfig"));
const Init_1 = __importDefault(require("./Init"));
const SrcProxy_1 = __importDefault(require("./dirProxy/src/SrcProxy"));
const chalk_1 = __importDefault(require("chalk"));
const TestMain_1 = __importDefault(require("./_test/TestMain"));
const PackageConfig_1 = __importDefault(require("./config/PackageConfig"));
const openUrl_1 = require("./alert/openUrl");
const esbuild_1 = require("esbuild");
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
            console.log(chalk_1.default.gray('---->'));
            console.log(chalk_1.default.magenta('本地主页:'), chalk_1.default.blue(BinProxy_1.default.getLocalHomePage()), chalk_1.default.green('推荐>更快⚡'));
            console.log(chalk_1.default.magenta('局域网主页:'), chalk_1.default.blue(BinProxy_1.default.getHomePage()));
            console.log(chalk_1.default.gray(`> ${PackageConfig_1.default.package.name}@${PackageConfig_1.default.package.version} 快捷命令:leb`));
            console.log(chalk_1.default.gray(`esbuild版本@${esbuild_1.version}`));
            console.log(chalk_1.default.gray('执行 leb -h 查看帮助或解决bug'));
            console.log(chalk_1.default.gray('...'));
            //打开本地主页
            MainConfig_1.default.config.ifOpenHome && openUrl_1.openUrl(BinProxy_1.default.getLocalHomePage());
            //测试
            TestMain_1.default.start();
        }));
    }
}
exports.default = layaboxEsbuild;
//# sourceMappingURL=Main.js.map