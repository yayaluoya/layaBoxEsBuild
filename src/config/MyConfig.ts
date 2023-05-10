import Tool from '../_T/Tool';

type webToolJsName = {
    /** 主脚本 */
    main: string;
    /** webSocket工具脚本 */
    webSocket: string;
    /** css内容 */
    css: string;
    /** web加载工具脚本 */
    load: string;
    /** alert工具 */
    alert: string;
};

/**
 * MyConfig
 */
export default class MyConfig {
    /** webSocket 端口 */
    public static webSocketPort: number;
    /** web工具脚本 */
    public static webToolJsName: webToolJsName = {
        main: 'main.js',
        webSocket: 'webSocketTool.js',
        css: 'webTool.css',
        load: 'loadTool.js',
        alert: 'alertTool.js',
    };
    /** web工具脚本唯一key */
    public static webToolJsOnlyKey: webToolJsName = {
        main: `${Date.now()}_1_${Tool.getRandomStr()}`,
        webSocket: `${Date.now()}_2_${Tool.getRandomStr()}`,
        css: `${Date.now()}_3_${Tool.getRandomStr()}`,
        load: `${Date.now()}_4_${Tool.getRandomStr()}`,
        alert: `${Date.now()}_5_${Tool.getRandomStr()}`,
    };
}
