import ResURL from "src/_T/ResURL";
import URLT from "src/_T/URLT";
const crypto = require('crypto');

/**
 * 文件模块
 * * 会把目标模块内容读取到内存中，方便下次访问，并在该文件被修改时自动更新
 */
export default class FileModule {
    /** 标识符，md5生成的 */
    private m_key: string;

    /** 修改版本 */
    private m_modifyV: string;
    /** 当前异步任务的修改版本 */
    private m_onTaskModifyV: string;

    /** 路径 */
    private m_url: string;
    /** 绝对路径 */
    private m_absolutePath: string;

    /** 任务 */
    private m_task: Promise<FileModule> = new Promise((r) => { r(this); });
    /** 内容 */
    private m_content: string = '';
    /** 更新次数 */
    private m_updateNumber: number = 0;

    /** 获取修改标识符 */
    public get modifyKey(): string {
        return this.m_key + '_' + this.m_modifyV;
    }

    /** 获取更新次数 */
    public get updateNumber(): number {
        return this.m_updateNumber;
    }

    /** 获取模块路径 */
    public get url(): string {
        return this.m_url;
    }
    /** 获取绝对路径 */
    public get absolutePath(): string {
        return this.m_absolutePath;
    }
    /** 获取 任务 */
    public get task(): Promise<FileModule> {
        //判断当前任务修改版本和历史修改版本是否一致，不一致就更新任务
        if (this.m_onTaskModifyV != this.m_modifyV) {
            this.updateTask();
        }
        //
        return this.m_task;
    }
    /** 获取 内容 */
    public get content(): string {
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
        this.m_onTaskModifyV = '';
        //
        this._init();
    }

    /** 初始化 */
    protected _init() { }

    /** 更新修改版本 */
    private updateModifyV() {
        this.m_modifyV = Date.now() + '_' + this.m_updateNumber;
    }

    /**
     * 更新内容
     */
    public update() {
        //更新次数刷新
        this.m_updateNumber++;
        //更新修改版本
        this.updateModifyV();
        //
        this._update();
    }

    /** 更新回调 */
    protected _update() { }

    /** 
     * 更新任务
     * ! 只会被动执行
     */
    private updateTask() {
        //重置修改版本
        this.m_onTaskModifyV = this.m_modifyV;
        //先判断地址是否存在
        if (this.m_url) {
            //
            let _task: Promise<FileModule> = this.m_task;
            //重置任务
            this.m_task = new Promise<FileModule>((r) => {
                //等上一个任务执行完之后在执行
                _task.then(() => {
                    //获取内容
                    this._updateContent().then((_content) => {
                        this.m_content = _content;
                        r(this);
                    }).catch((E) => {
                        console.error('错误', E);
                        r(this);
                    });
                });
            });
            //
        } else {
            this.m_task = new Promise<FileModule>((r, e) => {
                this.m_content = '';
                r(this);
            });
        }
    }

    /** 更新内容 */
    protected _updateContent(): Promise<string> {
        return new Promise<string>((r) => { r(''); });
    }
}