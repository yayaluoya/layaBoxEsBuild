"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainConfig_1 = require("../../config/MainConfig");
const MyConfig_1 = require("../../config/MyConfig");
const HttpTool_1 = require("../../http/HttpTool");
const ResURL_1 = require("../../_T/ResURL");
const URLT_1 = require("../../_T/URLT");
const VersionsT_1 = require("../../_T/VersionsT");
const fs = require('fs');
/**
 * bin目录工具
 */
class BinTool {
    /**
     * 获取web工具内容
     * @param _url 地址
     */
    static getWebTool(_url) {
        return new Promise((r) => {
            if (this.m_webToolJs[_url]) {
                r(this.m_webToolJs[_url]);
                return;
            }
            //获取地址
            let _jsUrl = URLT_1.default.join(ResURL_1.default.publicURL, _url);
            //读取文件
            fs.readFile(_jsUrl, (err, data) => {
                if (err) {
                    r(`没有找到web工具脚本,${_jsUrl}')`);
                    return;
                }
                let _content = data.toString();
                //根据不同文件做不同操作
                switch (true) {
                    //主脚本要替换版本
                    case new RegExp(`^/?${MyConfig_1.default.webToolJsName.main}$`).test(_url):
                        _content = _content.replace('${{v}}', VersionsT_1.default.getV());
                        break;
                    //webSocket工具脚本需要替换主机名和端口号
                    case new RegExp(`^/?${MyConfig_1.default.webToolJsName.webSocket}$`).test(_url):
                        _content = _content.replace('${{hostname}}', HttpTool_1.default.getHostname).replace('${{webSocketPort}}', MyConfig_1.default.webSocketPort + '');
                        break;
                }
                //存入缓存
                this.m_webToolJs[_url] = _content;
                //
                r(_content);
            });
        });
    }
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
                //在头部结束时加上css样式表和serviceWorkers工具脚本
                _html = _html.replace(/\<\/head\>/, `
<link rel="stylesheet" type="text/css" href="${ResURL_1.default.publicDirName}/${MyConfig_1.default.webToolJsName.css}">
<script type="text/javascript" src="${ResURL_1.default.publicDirName}/${MyConfig_1.default.webToolJsName.main}"></script>
<script type="text/javascript" src="${ResURL_1.default.publicDirName}/${MyConfig_1.default.webToolJsName.swTool}"></script>
<script type="text/javascript" src="${ResURL_1.default.publicDirName}/${MyConfig_1.default.webToolJsName.webSocket}"></script>
<script type="text/javascript" src="${ResURL_1.default.publicDirName}/${MyConfig_1.default.webToolJsName.alert}"></script>
</head>
                `);
                //在所有脚本前加上webload脚本
                _html = _html.replace(/\<body\>/, `<body>
<script type="text/javascript" src="${ResURL_1.default.publicDirName}/${MyConfig_1.default.webToolJsName.load}"></script>
                `);
                //包装loadLib函数内容，加一个模块的参数
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
     * 获取主页脚本文件内容
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
${_js.replace(new RegExp(`\\(["']/?${MainConfig_1.default.config.mainJs.replace(/^\//, '')}["']\\)`), `("http://${HttpTool_1.default.getHostname}:${MainConfig_1.default.config.port.src}/${MainConfig_1.default.config.mainTs.replace(/\..*?$/, '')}", 'module')`)}
                `;
                //
                r(_js);
            });
        });
    }
}
exports.default = BinTool;
/** web工具脚本内容缓存 */
BinTool.m_webToolJs = {};
//# sourceMappingURL=BinTool.js.map