#!/usr/bin/env node
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
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bugLog_1 = __importDefault(require("./bugLog"));
const Main_1 = __importDefault(require("../Main"));
const PackageConfig_1 = __importDefault(require("../config/PackageConfig"));
const getAbsolute_1 = require("../_T/getAbsolute");
const MainConfig_1 = __importDefault(require("../config/MainConfig"));
/** 默认配置文件地址 */
const defaultConfigFilePath = path_1.default.join(__dirname, '../../config.js');
/** 模板配置文件地址 */
const temConfigFIlePath = path_1.default.join(__dirname, '../../config_tem.js');
/** 配置文件名字 */
const configName = `leb_config@${PackageConfig_1.default.package.version.replace(/\./g, '-')}.js`;
const program = new commander_1.Command();
//定义其它选项
program
    .option('-v --version')
    .option('-h --help')
    .option('-i --init')
    .option('-s --start')
    .option('-c --config <url>')
    .option('-lc --log-config [url]')
    .option('-b --bug');
program
    .parse(process.argv);
//解析命令行参数
const options = program.opts();
// console.log(options);
//执行目录
let _cwdUrl = process.cwd();
(() => __awaiter(void 0, void 0, void 0, function* () {
    /** 默认配置文件 */
    let defaultConfig = yield getConfig(defaultConfigFilePath);
    /** 配置文件 */
    let config = yield getConfig(configName).catch(() => ({}));
    /** 临时配置文件 */
    let _config;
    switch (true) {
        case Boolean(options.version):
            console.log(chalk_1.default.green('当前layabox-esbuild的版本@ ') + chalk_1.default.yellow(PackageConfig_1.default.package.version));
            break;
        //帮助
        case Boolean(options.help):
            console.log('\n');
            console.log(chalk_1.default.green('layabox-esbuild工具的全部命令选项:'));
            console.log(chalk_1.default.gray('->'));
            console.log(chalk_1.default.magenta('快捷命令 leb'));
            console.log(chalk_1.default.blue('-v --version'), chalk_1.default.gray('查看当前layabox-esbuild工具版本'));
            console.log(chalk_1.default.blue('-h --help'), chalk_1.default.gray('查看帮助信息'));
            console.log(chalk_1.default.blue('-i --init'), chalk_1.default.gray('在当前执行目录初始化配置文件'));
            console.log(chalk_1.default.blue('-s --start'), chalk_1.default.gray('开始构建项目'));
            console.log(chalk_1.default.blue('-c --config <url>'), chalk_1.default.gray('指定配置文件来构建项目，参数为配置文件url，可以是绝对路径或者相对路径'));
            console.log(chalk_1.default.blue('-lc --log-config [url]'), chalk_1.default.gray('查看配置，不填的话则打印默认配置信息'));
            console.log(chalk_1.default.blue('-b --bug'), chalk_1.default.gray('查看可能的bug和对应的解决方案。'));
            console.log(chalk_1.default.gray('-'));
            console.log(chalk_1.default.gray('注意：参数是不用带\'或者\"符号的。'));
            break;
        //初始化
        case Boolean(options.init):
            let _configUrl = path_1.default.join(_cwdUrl, configName);
            //先查看是否有该文件
            fs_1.default.stat(_configUrl, (err, stats) => {
                if (!err && stats.isFile()) {
                    console.log(chalk_1.default.red('配置文件已经存在，请在该文件上添加配置。', _configUrl));
                    return;
                }
                //
                let stream = fs_1.default.createReadStream(temConfigFIlePath).pipe(fs_1.default.createWriteStream(_configUrl));
                stream.on('close', () => {
                    console.log(chalk_1.default.green('配置文件初始化完成。', _configUrl));
                });
            });
            //
            break;
        //查看配置
        case Boolean(options.logConfig):
            //
            console.log(chalk_1.default.yellow('配置数据:\n'));
            //
            if (typeof options.logConfig == 'string') {
                _config = yield getConfig(options.logConfig).catch((url) => {
                    console.log(chalk_1.default.red(`获取配置文件失败@${url}`));
                    return {};
                });
            }
            else {
                //默认在项目执行目录下找配置文件
                _config = config;
            }
            _config = MainConfig_1.default.merge(defaultConfig, _config);
            //
            console.log(_config);
            break;
        //指定配置构建
        case Boolean(options.config):
            _config = yield getConfig(options.config).catch((url) => {
                console.log(chalk_1.default.red(`获取配置文件失败@${url}`));
                return {};
            });
            build(MainConfig_1.default.merge(defaultConfig, _config));
            break;
        //开始构建
        case Boolean(options.start):
            build(MainConfig_1.default.merge(defaultConfig, config));
            break;
        //查看bug和解决方案
        case Boolean(options.bug):
            let i = 1;
            for (let { describe, resolve } of bugLog_1.default) {
                console.log(i++, chalk_1.default.red(describe));
                console.log(chalk_1.default.blue(resolve));
            }
            break;
        //直接执行，没有任何参数
        default:
            build(MainConfig_1.default.merge(defaultConfig, config));
            break;
    }
}))();
/**
 * 开始构建
 * @param config 配置信息
 */
function build(config = {}) {
    // console.log('开始构建', config);
    //开始
    Main_1.default.start(config);
}
/**
 * 通过一个地址获取配置信息
 * @param _url 地址 可以是相对地址也可以是绝对地址
 */
function getConfig(_url) {
    return new Promise((r, e) => {
        if (_url) {
            _url = getAbsolute_1.getAbsolute(_url);
            try {
                //动态导入配置，判断路径是否是绝对路径
                let _config = require(_url);
                //
                r(_config);
            }
            catch (err) {
                e(_url);
            }
        }
    });
}
//# sourceMappingURL=index.js.map