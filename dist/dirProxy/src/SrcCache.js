"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MainConfig_1 = __importDefault(require("../../config/MainConfig"));
const SrcModule_1 = __importDefault(require("./SrcModule"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = require("path");
/**
 * Src目录缓存
 */
class SrcCache {
    /**
     * 初始化
     */
    static init() {
        //添加计时器，每过一段时间自动更新所有版本变化的模块
        setInterval(() => {
            if (this.m_moduleCache.length == 0) {
                return;
            }
            let _i = 0;
            this.m_moduleCache.forEach((item) => {
                item.autoUpdateTask() ? _i++ : false;
            });
            if (_i > 0 && MainConfig_1.default.config.ifLog) {
                console.log(chalk_1.default.gray('>'));
                console.log(chalk_1.default.gray('预构建所有已修改模块->', _i));
            }
        }, 1000 * 60 * Math.max(1, MainConfig_1.default.config.autoUpdateTaskTime));
    }
    /**
     * 根据模块路径获取模块
     * @param _url 模块路径
     */
    static getModule(_url) {
        //是否从缓存里面拿
        let _ifCache = true;
        let _module = this.byUrlGetModule(path_1.join(MainConfig_1.default.config.src, _url));
        if (!_module) {
            _ifCache = false;
            _module = new SrcModule_1.default(_url);
            this.m_moduleCache.push(_module);
        }
        // console.log('获取模块', _url, _ifCache);
        return _module;
    }
    /**
     * 更新模块
     * @param _url 模块路径，包含后缀的格式
     */
    static updateModule(_url) {
        var _a;
        // console.log('准备更新模块', _url, this.m_moduleCache.map((item) => {
        //     return item.url;
        // }));
        //
        (_a = this.byUrlGetModule(_url)) === null || _a === void 0 ? void 0 : _a.update();
    }
    /**
     * 通过url获取模块，绝对路径，有的带后缀，有的不带
     * @param _url url
     */
    static byUrlGetModule(_url) {
        //把路径转成标准路径
        _url = _url.replace(/\\+/g, '/');
        //查找
        return this.m_moduleCache.find((item) => {
            /** 不区分大小写匹配 */
            let _b = false;
            //
            let _sus = [...MainConfig_1.default.config.srcFileDefaultSuffixs];
            let _su;
            let _susRegExp;
            for (let _i in _sus) {
                _su = _sus[_i];
                if (_su) {
                    _susRegExp = new RegExp(`\\.${_su}$`, 'i');
                    //先判断是否满足当前后缀的格式了，避免重复添加
                    _b = new RegExp(`^${item.normPath.replace(_susRegExp, '')}\\.${_su}$`, 'i').test(`${_url.replace(_susRegExp, '')}.${_su}`);
                }
                else {
                    _b = new RegExp(`^${item.normPath}$`, 'i').test(_url);
                }
                if (_b)
                    break;
            }
            //
            return _b;
        });
    }
}
exports.default = SrcCache;
/** 文件模块缓存列表 */
SrcCache.m_moduleCache = [];
//# sourceMappingURL=SrcCache.js.map