import BinProxy from "./dirProxy/bin/BinProxy";
import IConfig from "./config/IConfig";
import MainConfig from "./config/MainConfig";
import Init from "./Init";
import SrcProxy from "./dirProxy/src/SrcProxy";
import chalk from "chalk";
import TestMain from "./_test/TestMain";
import PackageConfig from "./config/PackageConfig";
import { openUrl } from "./alert/openUrl";
import { version } from "esbuild";

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
		Init.init().then(async () => {
			//代理src
			await SrcProxy.start();
			//代理bin
			await BinProxy.start();
			//提示bin目录的主页地址
			console.log(chalk.gray('---->'));
			console.log(chalk.magenta('本地主页:'), chalk.blue(BinProxy.getLocalHomePage()), chalk.green('推荐>更快⚡'));
			console.log(chalk.magenta('局域网主页:'), chalk.blue(BinProxy.getHomePage()));
			console.log(chalk.gray(`> ${PackageConfig.package.name}@${PackageConfig.package.version} 快捷命令:leb`));
			console.log(chalk.gray(`esbuild版本@${version}`));
			console.log(chalk.gray('执行 leb -h 查看帮助或解决bug'));
			console.log(chalk.gray('...'));
			//打开本地主页
			MainConfig.config.ifOpenHome && openUrl(BinProxy.getLocalHomePage());
			//测试
			TestMain.start();
		});
	}
}