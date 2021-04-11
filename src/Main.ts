import BinProxy from "./binProxy/BinProxy";
import IConfig from "./config/IConfig";
import MainConfig from "./config/MainConfig";
import Init from "./Init";
import SrcProxy from "./srcProxy/SrcProxy";
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
			console.log(chalk.green('主页地址:'), chalk.magenta(BinProxy.getHomePage()));
			console.log(chalk.gray('>'));
			console.log(chalk.gray('局域网也能通过这个地址访问主页，如果不能访问的话可能是当前电脑防火墙没有对外开放的原因，设置一下就行了。'));
		});
	}
}