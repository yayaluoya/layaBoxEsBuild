import MainConfig from "../config/MainConfig";
import MyConfig from "../config/MyConfig";
import HttpTool from "../http/HttpTool";
import ResURL from "../_T/ResURL";
import URLT from "../_T/URLT";
const fs = require('fs');

/**
 * bin目录工具
 */
export default class BinTool {
    /**
     * 获取主页代码
     */
    public static getHomePage(): Promise<string> {
        return new Promise<string>((r) => {
            //读取主页html
            let _html: string;
            let _htmlUrl: string = URLT.join(MainConfig.config.bin, MainConfig.config.homePage);
            fs.readFile(_htmlUrl, (err, data) => {
                if (err) {
                    r('没有找到主页html文件' + _htmlUrl);
                    return;
                }
                _html = data.toString();
                //先包装loadLib函数内容，加一个模块的参数
                _html = _html.replace(/function loadLib\([\s\S]*?\)[\s]\{[\s\S]*?\}/, `
    function loadLib(url, type = 'text/javascript') {
        var script = document.createElement("script");
        script.async = false;
        script.src = url;
        script.type = type;
        document.body.appendChild(script);
    }
                    `);
                //
                _html = `
<!-- 此文件被包装过，和源文件内容有差异。 -->
${_html}
                `;
                //
                r(_html);
            });
        });
    }

    /**
     * 获取欧主页脚本文件内容
     */
    public static getHomeJs(): Promise<string> {
        return new Promise<string>((r) => {
            let _js: string;
            let _jsUrl: string = URLT.join(MainConfig.config.bin, MainConfig.config.homeJs);
            fs.readFile(_jsUrl, (err, data) => {
                if (err) {
                    r(`alert('没有找到主页js脚本',${_jsUrl}')`);
                    return;
                }
                _js = data.toString();
                //替换主脚本地址
                _js = `
//! 此文件被包装过，和源文件内容有差异。
${_js.replace(new RegExp(`\\(["']/?${MainConfig.config.mainJs.replace(/^\//, '')}["']\\)`), `("http://${HttpTool.getHostname}:${MainConfig.config.port.src}/${MainConfig.config.mainTs.replace(/\..*?$/, '')}", 'module')`)}
//加入webSocket工具
loadLib("${MyConfig.webSocketToolJsName}");
                `;
                //
                r(_js);
            });
        });
    }

    /** webSocket工具脚本内容缓存 */
    private static m_webSocketToolJs: string;
    /**
     * 获取工具脚本
     */
    public static getWebSocketToolJs(): Promise<string> {
        return new Promise<string>((r) => {
            if (this.m_webSocketToolJs) {
                r(this.m_webSocketToolJs);
                return;
            }
            //读取webSocketjs脚本文件
            let _jsUrl: string = URLT.join(ResURL.publicURL, MyConfig.webSocketToolJsName);
            fs.readFile(_jsUrl, (err, data) => {
                if (err) {
                    r(`alert('没有找到webSocket工具脚本,${_jsUrl}');`);
                    return;
                }
                //替换主机地址和端口并存入缓存
                this.m_webSocketToolJs = (data.toString() as string).replace('${{hostname}}', HttpTool.getHostname).replace('${{webSocketPort}}', MyConfig.webSocketPort + '');
                //
                r(this.m_webSocketToolJs);
            });
        });
    }
}