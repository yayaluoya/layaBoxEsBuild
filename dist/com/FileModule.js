"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const moment = require("moment");
const MainConfig_1 = require("../config/MainConfig");
const URLT_1 = require("../_T/URLT");
const crypto = require('crypto');
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
        /** 任务 */
        this.m_task = new Promise((r) => { r(this); });
        /** 更新次数 */
        this.m_updateNumber = 0;
        //设置一个默认值
        this.m_content = {
            code: '',
            map: '',
        };
        //匹配用的reg
        let _reg = /\.([^\.]*?)$/;
        //剔除后缀
        this.m_url = _url;
        //提取后缀
        this.m_suffix = MainConfig_1.default.config.srcFileDefaultSuffix;
        let _suffix = _url.match(_reg);
        _suffix && (this.m_suffix = _suffix[1]);
        //
        // console.log('后缀', this.m_url, this.m_suffix);
        //
        this.m_absolutePath = URLT_1.default.join(MainConfig_1.default.config.src, this.m_url.replace(_reg, '')) + '.' + this.m_suffix;
        //通过url生成唯一标识符
        this.m_key = crypto.createHash('md5').update(this.m_absolutePath).digest('hex');
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
    /** 获取修改标识符 */
    get modifyKey() {
        return this.m_key + '_' + this.m_modifyV;
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
    /** 获取后缀 */
    get suffix() {
        return this.m_suffix;
    }
    /** 获取 任务 */
    get task() {
        //判断当前任务修改版本和历史修改版本是否一致，不一致就更新任务
        if (this.m_onTaskModifyV != this.m_modifyV) {
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
        this.m_modifyV = Date.now() + '_' + this.m_updateNumber;
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
                    this._updateContent().then((_content) => {
                        this.m_content = _content;
                    }).catch((E) => {
                        let _mes = '错误: ' + E;
                        this.m_content.code = `console.error(\`${_mes}\`);`;
                        console.error(chalk.gray(_mes));
                        console.error(chalk.gray(moment().format('LTS')));
                    }).finally(() => {
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
        return new Promise((r) => {
            r({
                code: '',
                map: '',
            });
        });
    }
}
exports.default = FileModule;
//# sourceMappingURL=FileModule.js.map