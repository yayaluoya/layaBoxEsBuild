/**
 * MyConfig
 */
export default class MyConfig {
    /** webSocket 端口 */
    public static webSocketPort: number;
    /** web工具脚本 */
    public static webToolJsName: {
        /** 主脚本 */
        main: string,
        /** webSocket工具脚本 */
        webSocket: string,
        /** css内容 */
        css: string,
        /** web加载工具脚本 */
        load: string,
        /** alert工具 */
        alert: string,
        /** sw文件 */
        sw: string,
        /** sw工具 */
        swTool: string,
    } = {
            main: 'main.js',
            webSocket: 'webSocketTool.js',
            css: 'webTool.css',
            load: 'loadTool.js',
            alert: 'alertTool.js',
            sw: 'sw.js',
            swTool: 'swTool.js',
        };
}