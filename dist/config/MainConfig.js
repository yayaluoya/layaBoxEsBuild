"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const URLT_1 = require("../_T/URLT");
/**
 * 主配置文件
 */
class MainConfig {
    /** 获取配置文件 */
    static get config() {
        return this.m_config;
    }
    /** 设置配置文件 */
    static set config(_c) {
        //只能设置一次
        if (this.m_config) {
            return;
        }
        //执行目录
        let _cwdUrl = process.cwd();
        //把_config中的几个关键路径转成绝对路径
        (!path.isAbsolute(_c.src)) && (_c.src = URLT_1.default.resolve(_cwdUrl, _c.src));
        (!path.isAbsolute(_c.bin)) && (_c.bin = URLT_1.default.resolve(_cwdUrl, _c.bin));
        //
        this.m_config = _c;
    }
}
exports.default = MainConfig;
//# sourceMappingURL=MainConfig.js.map