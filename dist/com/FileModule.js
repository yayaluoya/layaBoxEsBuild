"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MainConfig_1 = __importDefault(require("../config/MainConfig"));
const BufferT_1 = __importDefault(require("../_T/BufferT"));
const crypto_1 = __importDefault(require("crypto"));
const path_1 = require("path");
const Tool_1 = __importDefault(require("../_T/Tool"));
/**
 * 文件模块
 * * 会把目标模块内容读取到内存中，方便下次访问，并在该文件被修改时自动更新
 */
class FileModule {
    /**
     * 初始化
     * @param _url 模块路径
     */
    constructor(_url) {
        /** 是否缓存 */
        this.m_ifCache = true;
        /** 任务 */
        this.m_task = new Promise((r) => {
            r(this);
        });
        /** 更新次数 */
        this.m_updateNumber = 0;
        //设置一个默认值
        this.m_content = {
            code: BufferT_1.default.nullBuffer,
            map: BufferT_1.default.nullBuffer,
        };
        this.m_url = _url;
        //绝对路径
        this.m_absolutePath = path_1.join(MainConfig_1.default.config.src, this.m_url);
        this.m_normPath = this.m_absolutePath.replace(/\\+/g, '/');
        //通过url生成唯一标识符
        this.m_key = crypto_1.default
            .createHash('md5')
            .update(`${this.m_absolutePath}_${Tool_1.default.getRandomStr()}`)
            .digest('hex');
        //更新修改版本
        this.updateModifyV();
        //
        this.m_onTaskModifyV = '';
        //
        this._init();
    }
    /** 获取唯一标识符 */
    get key() {
        return this.m_key;
    }
    /** 获取更新次数 */
    get updateNumber() {
        return this.m_updateNumber;
    }
    /** 获取模块路径 */
    get url() {
        return this.m_url;
    }
    /** 获取绝对路径 */
    get absolutePath() {
        return this.m_absolutePath;
    }
    /** 获取标准路径 */
    get normPath() {
        return this.m_normPath;
    }
    /** 获取 任务 */
    get task() {
        //判断当前任务修改版本和历史修改版本是否一致，不一致就更新任务，如果不缓存的话直接更新任务
        if (!this.m_ifCache || this.m_onTaskModifyV != this.m_modifyV) {
            this.updateTask();
        }
        //
        return this.m_task;
    }
    /** 获取 内容 */
    get content() {
        return this.m_content;
    }
    /** 初始化 */
    _init() { }
    /** 更新修改版本 */
    updateModifyV() {
        this.m_modifyV = `${Date.now()}_${this.m_updateNumber}_${Tool_1.default.getRandomStr()}`;
    }
    /**
     * update方法
     */
    get updateH() {
        if (!this._updateH) {
            this._updateH = () => {
                this.update();
            };
        }
        return this._updateH;
    }
    /**
     * 更新内容
     */
    update() {
        //更新次数刷新
        this.m_updateNumber++;
        //更新修改版本
        this.updateModifyV();
        //
        this._update();
    }
    /** 更新回调 */
    _update() { }
    /**
     * 自动更新任务
     */
    autoUpdateTask() {
        //如果不缓存的话就不自动更新
        if (!this.m_ifCache) {
            return false;
        }
        //判断版本
        if (this.m_onTaskModifyV == this.m_modifyV)
            return false;
        //
        this.updateTask();
        this._autoUpdateTask();
        //
        return true;
    }
    /** 自动更新任务回调 */
    _autoUpdateTask() { }
    /**
     * 更新任务
     * ! 只会被动执行
     */
    updateTask() {
        //重置修改版本
        this.m_onTaskModifyV = this.m_modifyV;
        //先判断地址是否存在
        if (this.m_url) {
            //
            let _task = this.m_task;
            //重置任务
            this.m_task = new Promise((r) => {
                //等上一个任务执行完之后在执行
                _task.then(() => {
                    //获取内容
                    this._updateContent()
                        .then((_content) => {
                        // console.log(_content);
                        this.m_content = this._rightContent(_content);
                        //设置是否缓存
                        this.m_ifCache = _content.ifCache;
                        // console.log(this);
                    })
                        .catch((E) => {
                        //把错误内容以代码的形式添加进去
                        this.m_content.code = Buffer.from(this._mismanage(E));
                    })
                        .finally(() => {
                        r(this);
                    });
                });
            });
            //
        }
        else {
            this.m_task = Promise.resolve(this);
        }
    }
    /** 更新内容 */
    _updateContent() {
        return Promise.resolve({
            code: BufferT_1.default.nullBuffer,
            map: BufferT_1.default.nullBuffer,
        });
    }
    /** 处理正常的内容 */
    _rightContent(_content) {
        return _content;
    }
    /** 处理错误回调 */
    _mismanage(_e) {
        return _e;
    }
}
exports.default = FileModule;
//# sourceMappingURL=FileModule.js.map