import FileModule from "src/com/FileModule";
import TsBuild from "./TsBuild";
var moment = require('moment');
var chalk = require('chalk');

/**
 * Src模块
 */
export default class SrcModule extends FileModule {
    /** 更新总数 */
    private static m_updateSum: number = 0;

    /** 初始化回调 */
    protected _init() {
        //
        console.log(chalk.gray('-> 创建模块'));
        console.log(chalk.gray(this.absolutePath));
    }

    /**
     * 更新回调
     */
    public _update() {
        SrcModule.m_updateSum++;
        //
        console.log(chalk.gray('>'));
        console.log(chalk.gray('--> 模块更新'), chalk.yellow(this.absolutePath));
        console.log(chalk.gray('x', this.updateNumber), chalk.magenta('X', SrcModule.m_updateSum), chalk.blue(moment(Date.now()).format('HH:mm:ss')));
    }

    /** 更新内容 */
    protected _updateContent(): Promise<string> {
        //打包ts文件
        return TsBuild.build(this.url, this.suffix);
    }
}