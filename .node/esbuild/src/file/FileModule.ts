import FileBuild from "./FileBuild";
const chalk = require('chalk');
var moment = require('moment');
const crypto = require('crypto');

/**
 * 文件模块
 */
export default class FileModule {
    /** 标识符 */
    private m_key: string;

    /** 修改时间 */
    private m_modifyTime: number;

    /** 路径 */
    private m_url: string;

    /** 期约 */
    private m_promise: Promise<FileModule>;

    /** 内容 */
    private m_content: string;

    /** 更新次数 */
    private m_updateNumber: number = 0;

    /** 获取修改标识符 */
    public get modifyKey(): string {
        return this.m_key + '_' + this.m_modifyTime;
    }

    /** 获取模块路径 */
    public get url(): string {
        return this.m_url;
    }

    /** 获取 模块期约 */
    public get promise(): Promise<FileModule> {
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
        //通过url生成唯一标识符
        this.m_key = crypto.createHash('md5').update(_url).digest('hex');;
        //设置修改时间
        this.m_modifyTime = Date.now();
        //
        console.log(chalk.gray('-> 创建模块', this.m_url));
        //
        this.getContent();
    }

    /**
     * 更新内容
     */
    public update() {
        //
        // console.log('更新模块', this.m_url);
        let _time: number = Date.now();
        //重置修改时间
        this.m_modifyTime = _time;
        //
        this.getContent();
        //记录当前的promis
        let _promise: Promise<any> = this.promise;
        //
        _promise.then(() => {
            //判断当前的promise是否是最后一个执行的promise
            if (_promise == this.promise) {
                this.m_updateNumber++;
                console.log(chalk.gray('>'));
                console.log(chalk.green('----> 模块更新'), chalk.gray((Date.now() - _time) + 'ms'), chalk.yellow(this.m_url), chalk.magenta('x', this.m_updateNumber), chalk.gray(moment(Date.now()).format('HH:mm:ss')));
            }
        });
    }

    /** 获取内容 */
    private getContent() {
        //先判断地址是否存在
        if (this.m_url) {
            //初始化期约
            this.m_promise = new Promise<FileModule>((r, e) => {
                //打包文件
                FileBuild.build(this.m_url).then((_content) => {
                    //赋值内容
                    this.m_content = _content;
                    //
                    r(this);
                }).catch((E) => {
                    //空内容
                    this.m_content = '';
                    //
                    r(this);
                });
            });
        } else {
            this.m_promise = new Promise<FileModule>((r, e) => {
                this.m_content = '';
                r(this);
            });
        }
    }
}