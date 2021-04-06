/** 配置数据 */
module.exports = {
    /** 代理src目录，可以是绝对路径或者相对路径 */
    src: './test/src/',
    /** 代理bin目录，可以是绝对路径或者相对路径 */
    bin: './test/bin/',
    /** 文件路径修改，会把 a 匹配的替换成 b */
    filePathModify: [
        {
            a: /(["'])src\//,
            b: '$1/'
        }
    ],
    /** 代理端口，可以随便指定，只要不冲突就行 */
    port: {
        src: 3601,
        bin: 3602,
    },
    /** 入口文件名，地址相对于src目录 */
    mainTs: 'Main.ts',
    /** 主页， 相对于bin目录 */
    homePage: 'index.html',
    /** 主页脚本， 相对于bin目录 */
    homeJs: 'index.js',
    /** 入口js文件，相对于bin目录 */
    mainJs: 'js/bundle.js',
    /** 是否打印日志 */
    ifLog: false,
    /** 是否启用webSocket工具 */
    ifOpenWebSocketTool: true,
};