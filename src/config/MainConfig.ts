import path = require("path");
import URLT from "../_T/URLT";
import IConfig from "./IConfig";

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
        //执行目录
        let _cwdUrl = process.cwd();
        //把_config中的几个关键路径转成绝对路径
        (!path.isAbsolute(_c.src)) && (_c.src = URLT.resolve(_cwdUrl, _c.src));
        (!path.isAbsolute(_c.bin)) && (_c.bin = URLT.resolve(_cwdUrl, _c.bin));
        //
        this.m_config = _c;
    }
}