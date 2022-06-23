"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MainConfig_1 = __importDefault(require("../../config/MainConfig"));
const MyConfig_1 = __importDefault(require("../../config/MyConfig"));
const HttpTool_1 = __importDefault(require("../../http/HttpTool"));
const ResURL_1 = __importDefault(require("../../_T/ResURL"));
const VersionsT_1 = __importDefault(require("../../_T/VersionsT"));
const path_1 = require("path");
const fs_1 = require("fs");
const TemplateT_1 = __importDefault(require("../../_T/TemplateT"));
const PackageConfig_1 = __importDefault(require("../../config/PackageConfig"));
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
            let _jsUrl = path_1.join(ResURL_1.default.publicURL, _url);
            //读取文件
            fs_1.readFile(_jsUrl, (err, data) => {
                if (err) {
                    r(`没有找到web工具脚本,${_jsUrl}')`);
                    return;
                }
                let _content = data.toString();
                //根据不同文件做不同操作
                switch (true) {
                    //主脚本要替换版本，和包信息
                    case new RegExp(`${MyConfig_1.default.webToolJsName.main}$`).test(_url):
                        //进过序列化后的字符串必须对"进行转义处理
                        _content = TemplateT_1.default.ReplaceVariable(_content, {
                            version: VersionsT_1.default.getV(),
                            mainURL: `http://${HttpTool_1.default.getHostname}:${MainConfig_1.default.config.port.src}`,
                            webSocketUrl: `ws://${HttpTool_1.default.getHostname}:${MyConfig_1.default.webSocketPort}`,
                            ifUpdateNow: Boolean(MainConfig_1.default.config.ifUpdateNow).toString(),
                            packageJson: JSON.stringify({
                                name: PackageConfig_1.default.package.name,
                                version: PackageConfig_1.default.package.version,
                                authorName: PackageConfig_1.default.package.authorName,
                                description: PackageConfig_1.default.package.description,
                                repository: PackageConfig_1.default.package.repository,
                            }).replace(/"/g, '\\"'),
                        });
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
            let _htmlUrl = path_1.join(MainConfig_1.default.config.bin, MainConfig_1.default.config.homePage);
            fs_1.readFile(_htmlUrl, (err, data) => {
                if (err) {
                    r('没有找到主页html文件' + _htmlUrl);
                    return;
                }
                _html = data.toString();
                //在头部结束时加上css样式表和serviceWorkers工具脚本
                _html = _html.replace(/\<\/head\>/, `
<link rel="stylesheet" type="text/css" href="${ResURL_1.default.publicResURL}${MyConfig_1.default.webToolJsName.css}?q=${MyConfig_1.default
                    .webToolJsOnlyKey.css}">
<script type="text/javascript" src="${ResURL_1.default.publicSrcURL}${MyConfig_1.default.webToolJsName.main}?q=${MyConfig_1.default
                    .webToolJsOnlyKey.main}"></script>
<script type="text/javascript" src="${ResURL_1.default.publicSrcURL}${MyConfig_1.default.webToolJsName.webSocket}?q=${MyConfig_1.default
                    .webToolJsOnlyKey.webSocket}"></script>
${MainConfig_1.default.config.ifOpenWebSocketTool ? `<script type="text/javascript" src="${ResURL_1.default.publicSrcURL}${MyConfig_1.default.webToolJsName.alert}?q=${MyConfig_1.default
                    .webToolJsOnlyKey.alert}"></script>` : ''}
</head>
                `);
                //在所有脚本前加上webload脚本
                _html = _html.replace(/\<body\>/, `<body>
<script type="text/javascript" src="${ResURL_1.default.publicSrcURL}${MyConfig_1.default.webToolJsName.load}?q=${MyConfig_1.default
                    .webToolJsOnlyKey.load}"></script>
                `);
                //包装loadLib函数内容，加一个模块的参数
                _html = _html.replace(/function loadLib\([\s\S]*?\)[\s]\{[\s\S]*?\}/, `
    function loadLib(url) {
        var type = arguments.length <= 1 || arguments[1] === undefined ? 'text/javascript' : arguments[1];
        var script = document.createElement("script");
        script.async = false;
        script.src = url;
        script.type = type;
        document.body.appendChild(script);
    }
                    `);
                //添加提示
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
            let _jsUrl = path_1.join(MainConfig_1.default.config.bin, MainConfig_1.default.config.homeJs);
            fs_1.readFile(_jsUrl, (err, data) => {
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