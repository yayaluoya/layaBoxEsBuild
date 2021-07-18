"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MainConfig_1 = __importDefault(require("../config/MainConfig"));
var BufferT_1 = __importDefault(require("../_T/BufferT"));
var crypto_1 = __importDefault(require("crypto"));
var path_1 = require("path");
/**
 * 文件模块
 * * 会把目标模块内容读取到内存中，方便下次访问，并在该文件被修改时自动更新
 */
var FileModule = /** @class */ (function () {
    /**
     * 初始化
     * @param _url 模块路径
     */
    function FileModule(_url) {
        var _this = this;
        /** 任务 */
        this.m_task = new Promise(function (r) { r(_this); });
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
        this.m_normPath = this.m_absolutePath.replace(/\\/g, '/');
        //通过url生成唯一标识符
        this.m_key = crypto_1.default.createHash('md5').update(this.m_absolutePath).digest('hex');
        //更新修改版本
        this.updateModifyV();
        //
        this.m_onTaskModifyV = '';
        //
        this._init();
    }
    Object.defineProperty(FileModule.prototype, "key", {
        /** 获取唯一标识符 */
        get: function () {
            return this.m_key;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileModule.prototype, "modifyKey", {
        /** 获取修改标识符 */
        get: function () {
            return this.m_key + '_' + this.m_modifyV;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileModule.prototype, "updateNumber", {
        /** 获取更新次数 */
        get: function () {
            return this.m_updateNumber;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileModule.prototype, "url", {
        /** 获取模块路径 */
        get: function () {
            return this.m_url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileModule.prototype, "absolutePath", {
        /** 获取绝对路径 */
        get: function () {
            return this.m_absolutePath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileModule.prototype, "normPath", {
        /** 获取标准路径 */
        get: function () {
            return this.m_normPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileModule.prototype, "task", {
        /** 获取 任务 */
        get: function () {
            //判断当前任务修改版本和历史修改版本是否一致，不一致就更新任务
            if (this.m_onTaskModifyV != this.m_modifyV) {
                this.updateTask();
            }
            //
            return this.m_task;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileModule.prototype, "content", {
        /** 获取 内容 */
        get: function () {
            return this.m_content;
        },
        enumerable: true,
        configurable: true
    });
    /** 初始化 */
    FileModule.prototype._init = function () { };
    /** 更新修改版本 */
    FileModule.prototype.updateModifyV = function () {
        this.m_modifyV = Date.now() + '_' + this.m_updateNumber;
    };
    /**
     * 更新内容
     */
    FileModule.prototype.update = function () {
        //更新次数刷新
        this.m_updateNumber++;
        //更新修改版本
        this.updateModifyV();
        //
        this._update();
    };
    /** 更新回调 */
    FileModule.prototype._update = function () { };
    /**
     * 自动更新任务
     */
    FileModule.prototype.autoUpdateTask = function () {
        //判断版本
        if (this.m_onTaskModifyV == this.m_modifyV)
            return false;
        //
        this.updateTask();
        this._autoUpdateTask();
        //
        return true;
    };
    /** 自动更新任务回调 */
    FileModule.prototype._autoUpdateTask = function () { };
    /**
     * 更新任务
     * ! 只会被动执行
     */
    FileModule.prototype.updateTask = function () {
        var _this = this;
        //重置修改版本
        this.m_onTaskModifyV = this.m_modifyV;
        //先判断地址是否存在
        if (this.m_url) {
            //
            var _task_1 = this.m_task;
            //重置任务
            this.m_task = new Promise(function (r) {
                //等上一个任务执行完之后在执行
                _task_1.then(function () {
                    //获取内容
                    _this._updateContent().then(function (_content) {
                        // console.log(_content);
                        _this.m_content = _this._rightContent(_content);
                        // console.log(this);
                    }).catch(function (E) {
                        //把错误内容以代码的形式添加进去
                        _this.m_content.code = Buffer.from(_this._mismanage(E));
                    }).finally(function () {
                        r(_this);
                    });
                });
            });
            //
        }
        else {
            this.m_task = Promise.resolve(this);
        }
    };
    /** 更新内容 */
    FileModule.prototype._updateContent = function () {
        return Promise.resolve({
            code: BufferT_1.default.nullBuffer,
            map: BufferT_1.default.nullBuffer,
        });
    };
    /** 处理正常的内容 */
    FileModule.prototype._rightContent = function (_content) {
        return _content;
    };
    /** 处理错误回调 */
    FileModule.prototype._mismanage = function (_e) {
        return _e;
    };
    return FileModule;
}());
exports.default = FileModule;
//# sourceMappingURL=FileModule.js.map