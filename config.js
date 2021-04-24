/** 配置数据 */
module.exports = {
    /** 代理src目录，可以是绝对路径或者相对路径 */
    src: './src/',
    /** 代理bin目录，可以是绝对路径或者相对路径 */
    bin: './bin/',
    /** 文件路径修改，会把 a 匹配的替换成 b */
    filePathModify: [
        {
            a: /^src\//,
            b: '/'
        }
    ],
    /** 代理端口，可以随便指定，为0则自动分配，只要不冲突就行 */
    port: {
        src: 0,
        bin: 0,
    },
    /** src目录文件默认后缀  */
    srcFileDefaultSuffix: 'ts',
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
    /** 是否立即刷新浏览器 */
    ifUpdateNow: true,
};