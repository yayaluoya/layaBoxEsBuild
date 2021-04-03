/**
 * 配置表接口
 */
export default interface IConfig {
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
    /** 入口文件名，地址相对于src目录 */
    mainTs: string,
    /** 主页地址， 相对于bin目录 */
    homePage: string,
    /** 主页脚本， 相对于bin目录 */
    homeJs: string,
    /** 入口js文件，相对于bin目录 */
    mainJs: string,
    /** 是否打印日志 */
    ifLog: boolean,
    /** 是否启用webSocket工具 */
    ifOpenWebSocketTool: boolean,
}