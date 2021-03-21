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
    /** 文件路径修改 */
    filePathModify: {
        a: RegExp,
        b: string,
    }[];
    /** 是否压缩代码 */
    minify: boolean,
    /** 主页地址 */
    home: string,
}