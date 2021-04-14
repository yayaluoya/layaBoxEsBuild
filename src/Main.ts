import BinProxy from "./dirProxy/bin/BinProxy";
import IConfig from "./config/IConfig";
import MainConfig from "./config/MainConfig";
import Init from "./Init";
import SrcProxy from "./dirProxy/src/SrcProxy";
const chalk = require('chalk');

/**
 * layaboxEsbuild构建实例
 */
export default class layaboxEsbuild {

	/**
	 * 开始构建
	 */
	public static start(_config: IConfig) {
		//
		// console.log('配置信息', _config);
		//设置配置数据
		MainConfig.config = _config;
		//先初始化项目
		Init.init().then(() => {
			//代理src
			SrcProxy.start();
			//代理bin
			BinProxy.start();
			//提示bin目录的主页地址
			console.log(chalk.green('本地主页:'), chalk.magenta(BinProxy.getLocalHomePage()), chalk.gray('更快'));
			console.log(chalk.green('局域网主页:'), chalk.magenta(BinProxy.getHomePage()));
			console.log(chalk.gray('>'));
			console.log(chalk.gray('局域网主页如果不能访问的话可能是防火墙的原因。'));
		});
	}
}