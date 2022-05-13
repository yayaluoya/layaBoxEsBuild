#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import fs from "fs";
import defaultConfig from "./defaultConfig";
import PackageConfig, { IPackgeVersion } from "../config/PackageConfig";
import bugLog from "./bugLog";
import layaboxEsbuild from "../Main";
import IConfig from "../config/IConfig";
import GiteeTool from "./giteeTool";

/** 默认配置文件地址 */
const defaultConfigFilePath = path.join(__dirname, '../../config.js');
/** 配置文件名字 */
const configName = `leb_config@${PackageConfig.package.version.replace(/\./g, '-')}.js`;
//
const program = new Command();

//定义版本输出
program
    .version(PackageConfig.package.version);

//定义其它选项
program
    .option('-i --init')
    .option('-h, --help_')//防止和help重复
    .option('-s, --start')
    .option('-c, --config <url>')
    .option('--log-config [url]')
    .option('-vl, --v-log')
    .option('-bug, --bug')
    ;

//定义命令行类型
program
    .parse(process.argv);

//获取参数结果
const options = program.opts();
// console.log(options);
//执行目录
let _cwdUrl = process.cwd();
let _config: IConfig = {};
switch (true) {
    //初始化
    case Boolean(options.init):
        let _configUrl = path.join(_cwdUrl, configName);
        //先查看是否有该文件
        fs.stat(_configUrl, (err, stats) => {
            if (!err && stats.isFile()) {
                console.log(chalk.red('配置文件已经存在，请在该文件上添加配置。', _configUrl));
                return;
            }
            //
            let stream = fs.createReadStream(defaultConfigFilePath).pipe(fs.createWriteStream(_configUrl));
            stream.on('close', () => {
                console.log(chalk.green('配置文件初始化完成。', PackageConfig.package.version));
            });
        });
        //
        break;
    //帮助
    case Boolean(options.help_):
        console.log('\n');
        console.log(chalk.green('layabox-esbuild工具的全部命令选项:'));
        console.log(chalk.gray('->'));
        console.log(chalk.magenta('快捷命令 leb'));
        console.log(chalk.blue('-i'), chalk.gray('在当前执行目录初始化配置文件'));
        console.log(chalk.blue('-h'), chalk.gray('获取帮助信息'));
        console.log(chalk.blue('-s'), chalk.gray('开始构建项目'));
        console.log(chalk.blue('-c'), chalk.yellow('<url>'), chalk.gray('指定配置文件来构建项目，参数为配置文件url，可以是绝对路径或者相对路径'));
        console.log(chalk.blue('--log-config'), chalk.yellow('[url]'), chalk.gray('查看配置，不填的话则打印默认配置信息'));
        console.log(chalk.blue('-vl'), chalk.gray('查看所有记录版本信息，标注了废弃的版本请不要使用。'));
        console.log(chalk.blue('-bug'), chalk.gray('查看可能的bug和对应的解决方案。'));
        console.log(chalk.gray('-'));
        console.log(chalk.gray('注意：参数是不用带\'或者\"符号的。'));
        break;
    //查看配置
    case Boolean(options.logConfig):
        //
        console.log(chalk.yellow('配置数据:\n'));
        //
        if (typeof options.logConfig == 'string') {
            _config = getConfig(options.logConfig) || _config;
        } else {
            //默认在项目执行目录下找配置文件
            _config = getConfig(path.join(_cwdUrl, configName), false) || _config;
        }
        //组合配置内容
        _config = {
            ...defaultConfig,
            ..._config,
        };
        // console.log(_config);
        //把config中的几个关键路径转成绝对路径
        try {
            (!path.isAbsolute(_config.src)) && (_config.src = path.resolve(_cwdUrl, _config.src));
            (!path.isAbsolute(_config.bin)) && (_config.bin = path.resolve(_cwdUrl, _config.bin));
        } catch (e) { }
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
        _config = getConfig(path.join(_cwdUrl, configName), false);
        build(_config);
        break;
    //打印版本日志
    case Boolean(options.vLog):
        //发送请求，获取远程包文件
        GiteeTool.getFile(PackageConfig.package.remotePackgeJsonFileUrl)
            .then((_data) => {
                let _package = JSON.parse(_data);
                if (PackageConfig.package.version != _package.version) {
                    console.log(chalk.yellow(`远程最新版本为 ${_package.version} , 当前版本为 ${PackageConfig.package.version}\n可以执行 npm i layabox-esbuild -g 命令来安装最新版本`));
                }
                GiteeTool.getFile(PackageConfig.package.remotePackgeVersionJsonFileUrl)
                    .then((_data) => {
                        let _packageVersion: IPackgeVersion = JSON.parse(_data);
                        let _vl = PackageConfig.versionLog.versionLog || [];
                        let _r_vl = _packageVersion.versionLog || [];
                        if (_r_vl.length > 0) {
                            console.log(chalk.gray('所有版本信息：'));
                            for (let i = 0, length = _r_vl.length; i < length; i++) {
                                console.log(chalk.gray('\n->'));
                                if (_r_vl[i].v == PackageConfig.package.version) {
                                    console.log(chalk.yellow('当前版本'));
                                }
                                //先判断版本
                                if (_vl[i]) {
                                    console.log(_vl[i].v, _vl[i].log);
                                } else {
                                    console.log(chalk.blue('new', _r_vl[i].v, _r_vl[i].log));
                                }
                            }
                        }
                    })
                    .catch((e) => {
                        console.log(chalk.red('获取远程版本信息文件失败！具体原因为：'));
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(chalk.red('获取远程包文件失败！具体原因为：'));
                console.log(e);
            });
        break;
    //查看bug和解决方案
    case Boolean(options.bug):
        for (let { describe, resolve } of bugLog) {
            console.log(chalk.red(describe));
            console.log(chalk.blue(resolve));
        }
        break;
    //直接执行
    default:
        _config = getConfig(path.join(_cwdUrl, configName), false);
        build(_config);
        break;
}

/**
 * 开始构建
 * @param _config 配置信息
 */
function build(_config: IConfig = {}) {
    //开始
    layaboxEsbuild.start({
        //默认配置
        ...defaultConfig,
        //新增配置
        ..._config,
    });
}

/**
 * 通过一个地址获取配置信息
 * @param _url 地址 可以是相对地址也可以是绝对地址
 * @param _ifAlert 当获取失败时是否发出提示信息
 */
function getConfig(_url: string, _ifAlert: boolean = true): IConfig {
    //执行目录
    let _cwdUrl = process.cwd();
    let _config: IConfig;
    if (_url) {
        //配置文件路径
        _url = path.isAbsolute(_url) ? _url : path.resolve(_cwdUrl, _url);
        try {
            //动态导入配置，判断路径是否是绝对路径
            _config = require(_url);
        } catch (e) {
            //
            _ifAlert && console.log(chalk.red('获取配置文件失败，将使用默认配置！错误地址为: ', _url));
        }
    }
    //
    return _config;
}