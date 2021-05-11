#!/usr/bin/env node
const package = require('../package');
const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const https = require('https');
const bugJson = require('./bug.json');
const layaboxEsbuild = require('../dist/main.js');
/** 默认配置 */
const defaultConfig = require('../config.js');
/** 配置文件名字 */
const configName = 'layabox_esbuild_config.js';
//
const program = new Command();


//定义版本输出
program
    .version(package.version);

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
let _config = {};
switch (true) {
    //初始化
    case Boolean(options.init):
        let _defaultConfigUrl = path.join(__dirname, '../config.js');
        let _configUrl = path.join(_cwdUrl, configName);
        //先查看是否有该文件
        fs.stat(_configUrl, (err, stats) => {
            if (!err && stats.isFile()) {
                console.log(chalk.red('配置文件已经存在，请在该文件上添加配置。', _configUrl));
                return;
            }
            //
            let stream = fs.createReadStream(_defaultConfigUrl).pipe(fs.createWriteStream(_configUrl));
            stream.on('close', () => {
                console.log(chalk.green('配置文件初始化完成。'));
            });
        });
        //
        break;
    //帮助
    case Boolean(options.help_):
        console.log('\n');
        console.log(chalk.green('layabox-esbuild工具的全部命令选项:'));
        console.log(chalk.gray('->'));
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
        (!path.isAbsolute(_config.src)) && (_config.src = path.resolve(_cwdUrl, _config.src));
        (!path.isAbsolute(_config.bin)) && (_config.bin = path.resolve(_cwdUrl, _config.bin));
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
        https.get(package.remotePackgeFileUrl, (res) => {
            res.on('data', (d) => {
                let data = JSON.parse(d.toString());
                if (package.version != data.version) {
                    console.log(chalk.yellow(`远程最新版本为 ${data.version} , 当前版本为 ${package.version}\n可以执行 npm i layabox-esbuild -g 命令来安装最新版本`));
                }
                let _vl = package['version-log'] || [];
                let _r_vl = data['version-log'] || [];
                if (_r_vl.length > 0) {
                    console.log(chalk.gray('所有版本信息：'));
                    for (let i = 0, length = _r_vl.length; i < length; i++) {
                        console.log(chalk.gray('\n->'));
                        if (_r_vl[i].v == package.version) {
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
            });
        }).on('error', (e) => {
            console.log(chalk.red('获取远程版本失败！'));
        });
        break;
    //查看bug和解决方案
    case Boolean(options.bug):
        for (let { describe, resolve } of bugJson) {
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
 * @param {*} _config 配置信息
 */
function build(_config = {}) {
    //开始
    layaboxEsbuild.default.start({
        //默认配置
        ...defaultConfig,
        //新增配置
        ..._config,
    });
    //提示一下可能存在的bug
    alertBug();
}

/**
 * 通过一个地址获取配置信息
 * @param {*} _url 地址 可以是相对地址也可以是绝对地址
 * @param {*} _ifAlert 当获取失败时是否发出提示信息
 */
function getConfig(_url, _ifAlert = true) {
    //执行目录
    let _cwdUrl = process.cwd();
    let _config;
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

/**
 * 提示bug
 */
function alertBug() {
    //发送请求，获取远程bug提示信息
    https.get(package.remotePackgeFileUrl, (res) => {
        res.on('data', (d) => {
            let data = JSON.parse(d.toString());
            let _onVNumber = parseInt(package.version.replace(/\./g, ''));
            let _versionLog = data['version-log'] || [];
            let _bugs = [];
            //遍历日志，找出高版本的bug然后输出
            for (let _o of _versionLog) {
                // console.log(parseInt(_o['v'].replace(/\./g, '')), _onVNumber, _o['type']);
                if ((parseInt(_o['v'].replace(/\./g, '')) > _onVNumber) && _o['type'] == 'bug') {
                    _bugs.push(_o['log']);
                }
            }
            //输出bug日志
            if (_bugs.length > 0) {
                console.log(chalk.red('新版本修复了一些目前版本可能存在的bug，建议执行 npm i layabox-esbuild -g 重新安装工具：\n'));
                _bugs.forEach((item, _i) => {
                    console.log(chalk.yellow(_i + 1, item));
                });
                console.log(chalk.green('\n执行命令 layabox-esbuild -vl 查看全部版本信息'));
            }
        });
    });
}