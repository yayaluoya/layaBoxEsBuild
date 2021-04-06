#!/usr/bin/env node
const package = require('../package');
const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const layaboxEsbuild = require('../dist/main.js');
const config = require('../config.js');

//
const program = new Command();

//定义版本输出
program
    .version(package.version);

//定义其它选项
program
    .option('-h, --help_')//防止和help重复
    .option('-s, --start')
    .option('-c, --config <url>')
    .option('--log-config [url]')
    ;

//定义命令行类型
program
    .parse(process.argv);

//获取参数结果
const options = program.opts();
// console.log(options);

//帮助
if (options.help_) {
    console.log('\n');
    console.log(chalk.green('layabox-esbuild命令工具的全部参数类型:'));
    console.log(chalk.gray('->'));
    console.log(chalk.blue('-h'), chalk.gray('获取帮助信息'));
    console.log(chalk.blue('-s'), chalk.gray('开始构建项目'));
    console.log(chalk.blue('-c'), chalk.yellow('<url>'), chalk.gray('指定配置文件来构建项目，参数为配置文件url，可以是绝对路径或者相对路径'));
    console.log(chalk.blue('--log-config'), chalk.yellow('[url]'), chalk.gray('查看配置，不填的话则打印默认配置信息'));
    console.log(chalk.gray('-'));
    console.log(chalk.gray('注意：参数是不用带\'或者\"符号的。'));
}
//查看配置
else if (options.logConfig) {
    //
    let _config = config;
    console.log(chalk.yellow('配置数据:\n'));
    //
    if (typeof options.logConfig == 'string') {
        let __config = getConfig(options.logConfig);
        if (__config) {
            _config = __config;
        }
    }
    // console.log(_config);
    //执行目录
    let _cwdUrl = process.cwd();
    //把config中的几个关键路径转成绝对路径
    (!path.isAbsolute(_config.src)) && (_config.src = path.resolve(_cwdUrl, _config.src));
    (!path.isAbsolute(_config.bin)) && (_config.bin = path.resolve(_cwdUrl, _config.bin));
    //
    console.log(_config);
}
//开始
else {
    let _config = {};
    //设置配置信息
    if (options.config) {
        let __config = getConfig(options.config);
        if (__config) {
            _config = __config;
        }
        //修改了配置地址可以直接开始构建项目
        options.start = true;
    }
    //开始构建
    if (options.start) {
        //开始
        layaboxEsbuild.default.start({
            //默认配置
            ...config,
            //新增配置
            ..._config,
        });
    } else {
        console.log(chalk.yellow('没有执行任何操作，可能是执行时没有加参数，查看所有命令 -h'));
    }
}

/**
 * 获取配置信息
 */
function getConfig(_url) {
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
            console.log(chalk.red('获取配置文件失败！错误地址为: ', _url));
        }
    }
    //
    return _config;
}