"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MainConfig_1 = __importDefault(require("../../config/MainConfig"));
var SrcModule_1 = __importDefault(require("./SrcModule"));
var chalk_1 = __importDefault(require("chalk"));
var path_1 = require("path");
/**
 * Src目录缓存
 */
var SrcCache = /** @class */ (function () {
    function SrcCache() {
    }
    /**
     * 初始化
     */
    SrcCache.init = function () {
        var _this = this;
        //添加计时器，每过一段时间自动更新所有版本变化的模块
        setInterval(function () {
            if (_this.m_moduleCache.length == 0) {
                return;
            }
            var _i = 0;
            _this.m_moduleCache.forEach(function (item) {
                item.autoUpdateTask() ? _i++ : false;
            });
            if (_i > 0 && MainConfig_1.default.config.ifLog) {
                console.log(chalk_1.default.gray('>'));
                console.log(chalk_1.default.gray('预构建所有已修改模块->', _i));
            }
        }, 1000 * 60 * 3);
    };
    /**
     * 根据模块路径获取模块
     * @param _url 模块路径
     */
    SrcCache.getModule = function (_url) {
        //是否从缓存里面拿
        var _ifCache = true;
        var _module = this.byUrlGetModule(path_1.join(MainConfig_1.default.config.src, _url));
        if (!_module) {
            _ifCache = false;
            _module = new SrcModule_1.default(_url);
            this.m_moduleCache.push(_module);
        }
        // console.log('获取模块', _url, _ifCache);
        return _module;
    };
    /**
     * 更新模块
     * @param _url 模块路径，包含后缀的格式
     */
    SrcCache.updateModule = function (_url) {
        var _a;
        // console.log('准备更新模块', _url, this.m_moduleCache.map((item) => {
        //     return item.url;
        // }));
        (_a = this.byUrlGetModule(_url)) === null || _a === void 0 ? void 0 : _a.update();
    };
    /**
     * 通过url获取模块，绝对路径
     * @param _url url
     */
    SrcCache.byUrlGetModule = function (_url) {
        //判断是否包含后缀
        if (!/\.([^\.]*?)$/.test(_url)) {
            //加上默认后缀
            _url = _url + "." + MainConfig_1.default.config.srcFileDefaultSuffix;
        }
        //把路径中的\转意成/,不然匹配不到
        _url = _url.replace(/\\/g, '/');
        //查找
        var _SrcModule = this.m_moduleCache.find(function (item) {
            //* 不区分大小写匹配
            return new RegExp("^" + item.normPath + "$", 'i').test(_url);
        });
        //
        return _SrcModule;
    };
    /** 文件模块缓存列表 */
    SrcCache.m_moduleCache = [];
    return SrcCache;
}());
exports.default = SrcCache;
//# sourceMappingURL=SrcCache.js.map