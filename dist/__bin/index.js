#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var chalk_1 = __importDefault(require("chalk"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var defaultConfig_1 = __importDefault(require("./defaultConfig"));
var PackageConfig_1 = __importDefault(require("../config/PackageConfig"));
var bugLog_1 = __importDefault(require("./bugLog"));
var Main_1 = __importDefault(require("../Main"));
var giteeTool_1 = __importDefault(require("./giteeTool"));
/** 配置文件名字 */
var configName = "ayabox_esbuild_config@" + PackageConfig_1.default.package.version.replace(/\./g, '-') + ".js";
//
var program = new commander_1.Command();
//定义版本输出
program
    .version(PackageConfig_1.default.package.version);
//定义其它选项
program
    .option('-i --init')
    .option('-h, --help_') //防止和help重复
    .option('-s, --start')
    .option('-c, --config <url>')
    .option('--log-config [url]')
    .option('-vl, --v-log')
    .option('-bug, --bug');
//定义命令行类型
program
    .parse(process.argv);
//获取参数结果
var options = program.opts();
// console.log(options);
//执行目录
var _cwdUrl = process.cwd();
var _config = {};
switch (true) {
    //初始化
    case Boolean(options.init):
        var _defaultConfigUrl_1 = path_1.default.join(__dirname, '../config.js');
        var _configUrl_1 = path_1.default.join(_cwdUrl, configName);
        //先查看是否有该文件
        fs_1.default.stat(_configUrl_1, function (err, stats) {
            if (!err && stats.isFile()) {
                console.log(chalk_1.default.red('配置文件已经存在，请在该文件上添加配置。', _configUrl_1));
                return;
            }
            //
            var stream = fs_1.default.createReadStream(_defaultConfigUrl_1).pipe(fs_1.default.createWriteStream(_configUrl_1));
            stream.on('close', function () {
                console.log(chalk_1.default.green('配置文件初始化完成。', PackageConfig_1.default.package.version));
            });
        });
        //
        break;
    //帮助
    case Boolean(options.help_):
        console.log('\n');
        console.log(chalk_1.default.green('layabox-esbuild工具的全部命令选项:'));
        console.log(chalk_1.default.gray('->'));
        console.log(chalk_1.default.magenta('快捷命令 leb'));
        console.log(chalk_1.default.blue('-i'), chalk_1.default.gray('在当前执行目录初始化配置文件'));
        console.log(chalk_1.default.blue('-h'), chalk_1.default.gray('获取帮助信息'));
        console.log(chalk_1.default.blue('-s'), chalk_1.default.gray('开始构建项目'));
        console.log(chalk_1.default.blue('-c'), chalk_1.default.yellow('<url>'), chalk_1.default.gray('指定配置文件来构建项目，参数为配置文件url，可以是绝对路径或者相对路径'));
        console.log(chalk_1.default.blue('--log-config'), chalk_1.default.yellow('[url]'), chalk_1.default.gray('查看配置，不填的话则打印默认配置信息'));
        console.log(chalk_1.default.blue('-vl'), chalk_1.default.gray('查看所有记录版本信息，标注了废弃的版本请不要使用。'));
        console.log(chalk_1.default.blue('-bug'), chalk_1.default.gray('查看可能的bug和对应的解决方案。'));
        console.log(chalk_1.default.gray('-'));
        console.log(chalk_1.default.gray('注意：参数是不用带\'或者\"符号的。'));
        break;
    //查看配置
    case Boolean(options.logConfig):
        //
        console.log(chalk_1.default.yellow('配置数据:\n'));
        //
        if (typeof options.logConfig == 'string') {
            _config = getConfig(options.logConfig) || _config;
        }
        else {
            //默认在项目执行目录下找配置文件
            _config = getConfig(path_1.default.join(_cwdUrl, configName), false) || _config;
        }
        //组合配置内容
        _config = __assign(__assign({}, defaultConfig_1.default), _config);
        // console.log(_config);
        //把config中的几个关键路径转成绝对路径
        try {
            (!path_1.default.isAbsolute(_config.src)) && (_config.src = path_1.default.resolve(_cwdUrl, _config.src));
            (!path_1.default.isAbsolute(_config.bin)) && (_config.bin = path_1.default.resolve(_cwdUrl, _config.bin));
        }
        catch (e) { }
        //
        console.log(_config);
        break;
    //指定配置构建
    case Boolean(options.config):
        _config = getConfig(options.config);
        build(_config);
        break;
    //开始构建
    case Boolean(options.start):
        _config = getConfig(path_1.default.join(_cwdUrl, configName), false);
        build(_config);
        break;
    //打印版本日志
    case Boolean(options.vLog):
        //发送请求，获取远程包文件
        giteeTool_1.default.getFile(PackageConfig_1.default.package.remotePackgeJsonFileUrl)
            .then(function (_data) {
            var _package = JSON.parse(_data);
            if (PackageConfig_1.default.package.version != _package.version) {
                console.log(chalk_1.default.yellow("\u8FDC\u7A0B\u6700\u65B0\u7248\u672C\u4E3A " + _package.version + " , \u5F53\u524D\u7248\u672C\u4E3A " + PackageConfig_1.default.package.version + "\n\u53EF\u4EE5\u6267\u884C npm i layabox-esbuild -g \u547D\u4EE4\u6765\u5B89\u88C5\u6700\u65B0\u7248\u672C"));
            }
            giteeTool_1.default.getFile(PackageConfig_1.default.package.remotePackgeVersionJsonFileUrl)
                .then(function (_data) {
                var _packageVersion = JSON.parse(_data);
                var _vl = PackageConfig_1.default.versionLog.versionLog || [];
                var _r_vl = _packageVersion.versionLog || [];
                if (_r_vl.length > 0) {
                    console.log(chalk_1.default.gray('所有版本信息：'));
                    for (var i = 0, length_1 = _r_vl.length; i < length_1; i++) {
                        console.log(chalk_1.default.gray('\n->'));
                        if (_r_vl[i].v == PackageConfig_1.default.package.version) {
                            console.log(chalk_1.default.yellow('当前版本'));
                        }
                        //先判断版本
                        if (_vl[i]) {
                            console.log(_vl[i].v, _vl[i].log);
                        }
                        else {
                            console.log(chalk_1.default.blue('new', _r_vl[i].v, _r_vl[i].log));
                        }
                    }
                }
            })
                .catch(function (e) {
                console.log(chalk_1.default.red('获取远程版本信息文件失败！具体原因为：'));
                console.log(e);
            });
        })
            .catch(function (e) {
            console.log(chalk_1.default.red('获取远程包文件失败！具体原因为：'));
            console.log(e);
        });
        break;
    //查看bug和解决方案
    case Boolean(options.bug):
        for (var _i = 0, bugLog_2 = bugLog_1.default; _i < bugLog_2.length; _i++) {
            var _a = bugLog_2[_i], describe = _a.describe, resolve = _a.resolve;
            console.log(chalk_1.default.red(describe));
            console.log(chalk_1.default.blue(resolve));
        }
        break;
    //直接执行
    default:
        _config = getConfig(path_1.default.join(_cwdUrl, configName), false);
        build(_config);
        break;
}
/**
 * 开始构建
 * @param _config 配置信息
 */
function build(_config) {
    if (_config === void 0) { _config = {}; }
    //开始
    Main_1.default.start(__assign(__assign({}, defaultConfig_1.default), _config));
}
/**
 * 通过一个地址获取配置信息
 * @param _url 地址 可以是相对地址也可以是绝对地址
 * @param _ifAlert 当获取失败时是否发出提示信息
 */
function getConfig(_url, _ifAlert) {
    if (_ifAlert === void 0) { _ifAlert = true; }
    //执行目录
    var _cwdUrl = process.cwd();
    var _config;
    if (_url) {
        //配置文件路径
        _url = path_1.default.isAbsolute(_url) ? _url : path_1.default.resolve(_cwdUrl, _url);
        try {
            //动态导入配置，判断路径是否是绝对路径
            _config = require(_url);
        }
        catch (e) {
            //
            _ifAlert && console.log(chalk_1.default.red('获取配置文件失败，将使用默认配置！错误地址为: ', _url));
        }
    }
    //
    return _config;
}
//# sourceMappingURL=index.js.map