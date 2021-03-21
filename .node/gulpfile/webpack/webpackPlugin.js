const chalk = require('chalk');
const path = require('path');
const { getTime } = require("../_T");

//插件名称
const pluginName = 'onePlugin';

//编译次数
let count = 0;

/**
 * webpack插件
 */
class webpackPlugin {
	apply(compiler) {
		/**
		 * 编译完成回调
		 */
		compiler.hooks.done.tapAsync(pluginName, (stats, callback) => {
			//执行回调
			callback();
			//
			count++;
			//打印消息
			let errorsData = stats.compilation.errors;
			let mes;
			if (errorsData.length > 0) {
				mes = chalk.red(' 错误：' + errorsData.length);
			} else {
				mes = chalk.blue(' 完成 ');
			}
			// console.log(stats.compilation);
			//首页提示
			console.log(chalk.yellow('----▷ 主页：', path.resolve(__dirname, '../../../bin/index.html')));
			console.log(chalk.magenta('----▷ 第'), chalk.green(` ${count} `), chalk.magenta('次编辑'), ` ${getTime()} `, chalk.red(mes));
		});
	}
}

//
module.exports = webpackPlugin;