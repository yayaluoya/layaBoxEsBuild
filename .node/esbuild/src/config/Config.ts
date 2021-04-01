const config = require('../../config.js');

/**
 * 配置表
 */
let Config: IConfig = config;

//
export default Config;

/**
 * 配置表接口
 */
export interface IConfig {
    /** 代理文件夹目录 */
    src: string,
    /** bin目录 */
    bin: string,
    /** 文件路径修改 */
    filePathModify: {
        a: RegExp,
        b: string,
    }[];
    /** 代理端口 */
    port: {
        src: number,
        bin: number,
    },
    /** 主页地址， 相对于bin目录 */
    homePage: string,
    /** 主页脚本， 相对于bin目录 */
    homeJs: string,
}