"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
/**
 * 主配置文件
 */
var MainConfig = /** @class */ (function () {
    function MainConfig() {
    }
    Object.defineProperty(MainConfig, "config", {
        /** 获取配置文件 */
        get: function () {
            return this.m_config;
        },
        /** 设置配置文件 */
        set: function (_c) {
            //只能设置一次
            if (this.m_config) {
                return;
            }
            //执行目录
            var _cwdUrl = process.cwd();
            //把_config中的几个关键路径转成绝对路径
            (!path_1.isAbsolute(_c.src)) && (_c.src = path_1.resolve(_cwdUrl, _c.src));
            (!path_1.isAbsolute(_c.bin)) && (_c.bin = path_1.resolve(_cwdUrl, _c.bin));
            //
            this.m_config = _c;
        },
        enumerable: false,
        configurable: true
    });
    return MainConfig;
}());
exports.default = MainConfig;
//# sourceMappingURL=MainConfig.js.map