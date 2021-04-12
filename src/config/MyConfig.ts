/**
 * MyConfig
 */
export default class MyConfig {
    /** webSocket 端口 */
    public static webSocketPort: number = 3600;
    /** web工具脚本 */
    public static webToolJsName: {
        /** css内容 */
        css: string,
        /** webSocket工具脚本 */
        webSocket: string,
        /** web加载工具脚本 */
        load: string,
    } = {
            webSocket: 'webSocketTool.js',
            load: 'webLoadTool.js',
            css: 'webTool.css',
        };
}