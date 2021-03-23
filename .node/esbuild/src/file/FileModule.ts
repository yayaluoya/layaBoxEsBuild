import ResURL from "src/_T/ResURL";
import URLT from "src/_T/URLT";
import FileBuild from "./FileBuild";
const chalk = require('chalk');
var moment = require('moment');
const crypto = require('crypto');

/**
 * 文件模块
 */
export default class FileModule {
    /** 更新总数 */
    private static updateSum: number = 0;

    /** 标识符，md5生成的 */
    private m_key: string;

    /** 修改版本 */
    private m_modifyV: string;
    /** 当前异步任务的修改版本 */
    private m_onPromiseModifyV: string;

    /** 路径 */
    private m_url: string;
    /** 绝对路径 */
    private m_absolutePath: string;

    /** 任务 */
    private m_promise: Promise<FileModule> = new Promise((r) => { r(undefined); });
    /** 内容 */
    private m_content: string = '';
    /** 更新次数 */
    private m_updateNumber: number = 0;

    /** 获取修改标识符 */
    public get modifyKey(): string {
        return this.m_key + '_' + this.m_modifyV;
    }

    /** 获取模块路径 */
    public get url(): string {
        return this.m_url;
    }
    /** 获取 模块任务 */
    public get promise(): Promise<FileModule> {
        //判断当前任务修改版本和历史修改版本是否一致，不一致就更新任务
        if (this.m_onPromiseModifyV != this.m_modifyV) {
            this.updatePromise();
        }
        return this.m_promise;
    }
    /** 获取 代码内容 */
    public get code(): string {
        return this.m_content;
    }

    /**
     * 初始化
     * @param _url 模块路径
     */
    public constructor(_url: string) {
        this.m_url = _url;
        this.m_absolutePath = URLT.join(ResURL.srcURL, this.m_url) + '.ts';
        //通过url生成唯一标识符
        this.m_key = crypto.createHash('md5').update(_url).digest('hex');
        //更新修改版本
        this.updateModifyV();
        //
        this.m_onPromiseModifyV = '';
        //
        console.log(chalk.gray('-> 创建模块'));
        console.log(chalk.gray(this.m_absolutePath));
    }

    /** 更新修改版本 */
    public updateModifyV() {
        this.m_modifyV = Date.now() + '_' + this.m_updateNumber;
    }

    /**
     * 更新内容
     */
    public update() {
        //更新次数刷新
        this.m_updateNumber++;
        FileModule.updateSum++;
        //更新修改版本
        this.updateModifyV();
        //
        console.log(chalk.gray('>'));
        console.log(chalk.green('--> 模块更新'), chalk.yellow(this.m_absolutePath));
        console.log(chalk.magenta('x', this.m_updateNumber, 'X', FileModule.updateSum), chalk.blue(moment(Date.now()).format('HH:mm:ss')));
    }

    /** 
     * 更新任务
     * ! 只会被动执行
     */
    private updatePromise() {
        //重置修改版本
        this.m_onPromiseModifyV = this.m_modifyV;
        //先判断地址是否存在
        if (this.m_url) {
            //
            let _promise: Promise<FileModule> = this.m_promise;
            this.m_promise = new Promise<FileModule>((r, e) => {
                //等上一个任务执行完之后在执行
                _promise.then(() => {
                    //打包文件
                    FileBuild.build(this.m_url).then((_content) => {
                        //赋值内容
                        this.m_content = _content;
                        //
                        r(this);
                    }).catch((E) => {
                        //
                        r(this);
                    });
                });
            });
            //
        } else {
            this.m_promise = new Promise<FileModule>((r, e) => {
                this.m_content = '';
                r(this);
            });
        }
    }
}