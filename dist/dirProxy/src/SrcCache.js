"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainConfig_1 = require("../../config/MainConfig");
const SrcModule_1 = require("./SrcModule");
var chalk = require('chalk');
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
                console.log(chalk.gray('>'));
                console.log(chalk.gray('预构建所有已修改模块->', _i));
            }
        }, 1000 * 60 * 3);
    }
    /**
     * 根据模块路径获取模块
     * @param _url 模块路径
     */
    static getModule(_url) {
        //是否从缓存里面拿
        let _ifCache = true;
        let _module = this.byUrlGetModule(_url);
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
        (_a = this.byUrlGetModule(_url)) === null || _a === void 0 ? void 0 : _a.update();
    }
    /**
     * 通过url获取模块
     * @param _url url
     */
    static byUrlGetModule(_url) {
        //是否包含后缀
        let _ifSuffix = /\..*?$/.test(_url);
        //查找
        let _SrcModule = this.m_moduleCache.find((item) => {
            return (_ifSuffix ? new RegExp(`^${item.url + '.' + item.suffix}$`, 'i') : new RegExp(`^${item.url}$`, 'i')).test(_url);
        });
        //
        // console.log('更新模块', _url, _SrcModule && _SrcModule.url);
        //
        return _SrcModule;
    }
}
exports.default = SrcCache;
/** 文件模块缓存列表 */
SrcCache.m_moduleCache = [];
//# sourceMappingURL=SrcCache.js.map