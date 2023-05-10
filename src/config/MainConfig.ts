import IConfig from './IConfig';
import { getAbsolute } from '../_T/getAbsolute';
import { ObjectUtils } from 'yayaluoya-tool/dist/obj/ObjectUtils';

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
        return ObjectUtils.merge(c, ...cs);
    }
}
