"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainConfig_1 = require("../config/MainConfig");
const MyConfig_1 = require("../config/MyConfig");
const ResURL_1 = require("../_T/ResURL");
const URLT_1 = require("../_T/URLT");
const fs = require('fs');
/**
 * bin目录工具
 */
class BinTool {
    /**
     * 获取主页代码
     */
    static getHomePage() {
        return new Promise((r) => {
            //读取主页html
            let _html;
            let _htmlUrl = URLT_1.default.join(MainConfig_1.default.config.bin, MainConfig_1.default.config.homePage);
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
    static getHomeJs() {
        return new Promise((r) => {
            let _js;
            let _jsUrl = URLT_1.default.join(MainConfig_1.default.config.bin, MainConfig_1.default.config.homeJs);
            fs.readFile(_jsUrl, (err, data) => {
                if (err) {
                    r(`alert('没有找到主页js脚本',${_jsUrl}')`);
                    return;
                }
                _js = data.toString();
                //替换主脚本地址
                _js = `
//! 此文件被包装过，和源文件内容有差异。
${_js.replace(new RegExp(`\\(["']/?${MainConfig_1.default.config.mainJs.replace(/^\//, '')}["']\\)`), `("http://localhost:${MainConfig_1.default.config.port.src}/${MainConfig_1.default.config.mainTs.replace(/\..*?$/, '')}", 'module')`)}
//加入webSocket工具
loadLib("${MyConfig_1.default.webSocketToolJsName}");
                `;
                //
                r(_js);
            });
        });
    }
    /**
     * 获取工具脚本
     */
    static getWebSocketToolJs() {
        return new Promise((r) => {
            if (this.m_webSocketToolJs) {
                r(this.m_webSocketToolJs);
                return;
            }
            //读取webSocketjs脚本文件
            let _jsUrl = URLT_1.default.join(ResURL_1.default.publicURL, MyConfig_1.default.webSocketToolJsName);
            fs.readFile(_jsUrl, (err, data) => {
                if (err) {
                    r(`alert('没有找到webSocket工具脚本,${_jsUrl}');`);
                    return;
                }
                //存入缓存
                this.m_webSocketToolJs = data.toString();
                //
                r(this.m_webSocketToolJs);
            });
        });
    }
}
exports.default = BinTool;
//# sourceMappingURL=BinTool.js.map