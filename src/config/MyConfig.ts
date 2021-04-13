/**
 * MyConfig
 */
export default class MyConfig {
    /** webSocket 端口 */
    public static webSocketPort: number = 3600;
    /** web工具脚本 */
    public static webToolJsName: {
        /** webSocket工具脚本 */
        webSocket: string,
        /** css内容 */
        css: string,
        /** web加载工具脚本 */
        load: string,
        /** alert工具 */
        alert: string,
    } = {
            webSocket: 'webSocketTool.js',
            css: 'webTool.css',
            load: 'loadTool.js',
            alert: 'alertTool.js',
        };
}