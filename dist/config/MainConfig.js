"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getAbsolute_1 = require("../_T/getAbsolute");
const ObjectUtils_1 = require("yayaluoya-tool/dist/obj/ObjectUtils");
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
        this.handleConfig(_c);
        this.m_config = _c;
    }
    /**
     * 处理配置文件
     * @param c
     */
    static handleConfig(c) {
        //相对路径转绝对路径
        c.src = getAbsolute_1.getAbsolute(c.src);
        c.bin = getAbsolute_1.getAbsolute(c.bin);
        //文件查找后缀列表加上空后缀并去重
        c.srcFileDefaultSuffixs.push('');
        c.srcFileDefaultSuffixs = [...new Set(c.srcFileDefaultSuffixs)];
        //
        return c;
    }
    /**
     * 合并配置文件
     * @param c
     * @param cs
     * @returns
     */
    static merge(c, ...cs) {
        return ObjectUtils_1.ObjectUtils.merge(c, ...cs);
    }
}
exports.default = MainConfig;
//# sourceMappingURL=MainConfig.js.map