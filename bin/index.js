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
    .option('-h, --help')
    .option('-s, --start')
    .option('-c, --config <config>')
//定义命令行类型
program
    .parse(process.argv);

//获取参数结果
const options = program.opts();
//判断参数
if (options.help) {
    console.log('\n');
    console.log(chalk.green('layabox-esbuild全部命令:'));
    console.log(chalk.gray('->'));
    console.log(chalk.blue('-h'), chalk.gray('获取帮助信息'));
    console.log(chalk.blue('-s'), chalk.gray('开始构建项目'));
    console.log(chalk.blue('-c'), chalk.yellow('<config [url]>'), chalk.gray('指定配置文件来构建项目'));
    console.log('\n');
}
else {
    let _config = {};
    //设置配置信息
    if (options.config) {
        _config = require(path.resolve(process.cwd(), options.config));
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
    }
}