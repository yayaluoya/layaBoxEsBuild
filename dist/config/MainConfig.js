"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var URLT_1 = __importDefault(require("../_T/URLT"));
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
            (!path.isAbsolute(_c.src)) && (_c.src = URLT_1.default.resolve(_cwdUrl, _c.src));
            (!path.isAbsolute(_c.bin)) && (_c.bin = URLT_1.default.resolve(_cwdUrl, _c.bin));
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