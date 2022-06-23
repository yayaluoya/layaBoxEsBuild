import IConfig from "./IConfig";
import { getAbsolute } from "../_T/getAbsolute";

/**
 * 主配置文件
 */
export default class MainConfig {
    /** 配置文件 */
    private static m_config: IConfig;

    /** 获取配置文件 */
    public static get config(): IConfig {
        return this.m_config;
    }

    /** 设置配置文件 */
    public static set config(_c: IConfig) {
        //只能设置一次
        if (this.m_config) { return; }
        this.handleConfig(_c);
        this.m_config = _c;
    }

    /**
     * 处理配置文件
     * @param c 
     */
    public static handleConfig(c: IConfig): IConfig {
        //相对路径转绝对路径
        c.src = getAbsolute(c.src);
        c.bin = getAbsolute(c.bin);
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
    public static merge(c: IConfig, ...cs: IConfig[]): IConfig {
        return mergeConfig(c, ...cs);
    }
}

/**
 * 合并配置文件
 * @param a 
 * @param bs 
 * @returns 
 */
function mergeConfig<T>(a: any, ...bs: any): T {
    for (let b of bs) {
        for (let i in b) {
            if (Array.isArray(a[i])) {
                a[i].push(...(b[i] || []));
                continue;
            }
            if (a[i] && typeof a[i] == 'object') {
                mergeConfig(a[i], b[i] || {});
                continue;
            }
            //
            a[i] = b[i];
        }
    }
    return a;
}