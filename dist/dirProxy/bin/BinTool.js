"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MainConfig_1 = __importDefault(require("../../config/MainConfig"));
var MyConfig_1 = __importDefault(require("../../config/MyConfig"));
var PackageJson_1 = __importDefault(require("../../config/PackageJson"));
var HttpTool_1 = __importDefault(require("../../http/HttpTool"));
var ResURL_1 = __importDefault(require("../../_T/ResURL"));
var URLT_1 = __importDefault(require("../../_T/URLT"));
var VersionsT_1 = __importDefault(require("../../_T/VersionsT"));
var fs = require('fs');
/**
 * bin目录工具
 */
var BinTool = /** @class */ (function () {
    function BinTool() {
    }
    /**
     * 获取web工具内容
     * @param _url 地址
     */
    BinTool.getWebTool = function (_url) {
        var _this = this;
        return new Promise(function (r) {
            if (_this.m_webToolJs[_url]) {
                r(_this.m_webToolJs[_url]);
                return;
            }
            //获取地址
            var _jsUrl = URLT_1.default.join(ResURL_1.default.publicURL, _url);
            //读取文件
            fs.readFile(_jsUrl, function (err, data) {
                if (err) {
                    r("\u6CA1\u6709\u627E\u5230web\u5DE5\u5177\u811A\u672C," + _jsUrl + "')");
                    return;
                }
                var _content = data.toString();
                //根据不同文件做不同操作
                switch (true) {
                    //主脚本要替换版本，和包信息
                    case new RegExp(MyConfig_1.default.webToolJsName.main + "$").test(_url):
                        _content = _content.replace('${{v}}', VersionsT_1.default.getV()).replace('{{packageJson}}', JSON.stringify({
                            name: PackageJson_1.default['name'],
                            version: PackageJson_1.default['version'],
                            authorName: PackageJson_1.default['authorName'],
                            description: PackageJson_1.default['description'],
                            repository: PackageJson_1.default['repository'],
                            remotePackgeFileUrl: PackageJson_1.default['remotePackgeFileUrl'],
                        }).replace(/"/g, '\"'));
                        break;
                    //webSocket工具脚本需要替换主机名和端口号
                    case new RegExp(MyConfig_1.default.webToolJsName.webSocket + "$").test(_url):
                        _content = _content.replace('${{hostname}}', HttpTool_1.default.getHostname).replace('${{webSocketPort}}', MyConfig_1.default.webSocketPort + '');
                        break;
                    //alert工具脚本需要替换是否时刻刷新浏览器的变量
                    case new RegExp(MyConfig_1.default.webToolJsName.alert + "$").test(_url):
                        _content = _content.replace('$ifUpdateNow', Boolean(MainConfig_1.default.config.ifUpdateNow).toString());
                        break;
                }
                //存入缓存
                _this.m_webToolJs[_url] = _content;
                //
                r(_content);
            });
        });
    };
    /**
     * 获取主页代码
     */
    BinTool.getHomePage = function () {
        return new Promise(function (r) {
            //读取主页html
            var _html;
            var _htmlUrl = URLT_1.default.join(MainConfig_1.default.config.bin, MainConfig_1.default.config.homePage);
            fs.readFile(_htmlUrl, function (err, data) {
                if (err) {
                    r('没有找到主页html文件' + _htmlUrl);
                    return;
                }
                _html = data.toString();
                //在头部结束时加上css样式表和serviceWorkers工具脚本
                _html = _html.replace(/\<\/head\>/, "\n<link rel=\"stylesheet\" type=\"text/css\" href=\"" + ResURL_1.default.publicResURL + MyConfig_1.default.webToolJsName.css + "\">\n<script type=\"text/javascript\" src=\"" + ResURL_1.default.publicSrcURL + MyConfig_1.default.webToolJsName.main + "\"></script>\n<script type=\"text/javascript\" src=\"" + ResURL_1.default.publicSrcURL + MyConfig_1.default.webToolJsName.webSocket + "\"></script>\n<script type=\"text/javascript\" src=\"" + ResURL_1.default.publicSrcURL + MyConfig_1.default.webToolJsName.swTool + "\"></script>\n" + (MainConfig_1.default.config.ifOpenWebSocketTool ? "<script type=\"text/javascript\" src=\"" + ResURL_1.default.publicSrcURL + MyConfig_1.default.webToolJsName.alert + "\"></script>" : '') + "\n</head>\n                ");
                //在所有脚本前加上webload脚本
                _html = _html.replace(/\<body\>/, "<body>\n<script type=\"text/javascript\" src=\"" + ResURL_1.default.publicSrcURL + MyConfig_1.default.webToolJsName.load + "\"></script>\n                ");
                //包装loadLib函数内容，加一个模块的参数
                _html = _html.replace(/function loadLib\([\s\S]*?\)[\s]\{[\s\S]*?\}/, "\n    function loadLib(url) {\n        var type = arguments.length <= 1 || arguments[1] === undefined ? 'text/javascript' : arguments[1];\n        var script = document.createElement(\"script\");\n        script.async = false;\n        script.src = url;\n        script.type = type;\n        document.body.appendChild(script);\n    }\n                    ");
                //
                _html = "\n<!-- \u6B64\u6587\u4EF6\u88AB\u5305\u88C5\u8FC7\uFF0C\u548C\u6E90\u6587\u4EF6\u5185\u5BB9\u6709\u5DEE\u5F02\u3002 -->\n" + _html + "\n                ";
                //
                r(_html);
            });
        });
    };
    /**
     * 获取主页脚本文件内容
     */
    BinTool.getHomeJs = function () {
        return new Promise(function (r) {
            var _js;
            var _jsUrl = URLT_1.default.join(MainConfig_1.default.config.bin, MainConfig_1.default.config.homeJs);
            fs.readFile(_jsUrl, function (err, data) {
                if (err) {
                    r("alert('\u6CA1\u6709\u627E\u5230\u4E3B\u9875js\u811A\u672C'," + _jsUrl + "')");
                    return;
                }
                _js = data.toString();
                //替换主脚本地址
                _js = "\n//! \u6B64\u6587\u4EF6\u88AB\u5305\u88C5\u8FC7\uFF0C\u548C\u6E90\u6587\u4EF6\u5185\u5BB9\u6709\u5DEE\u5F02\u3002\n" + _js.replace(new RegExp("\\([\"']/?" + MainConfig_1.default.config.mainJs.replace(/^\//, '') + "[\"']\\)"), "(\"http://" + HttpTool_1.default.getHostname + ":" + MainConfig_1.default.config.port.src + "/" + MainConfig_1.default.config.mainTs.replace(/\..*?$/, '') + "\", 'module')") + "\n                ";
                //
                r(_js);
            });
        });
    };
    /** web工具脚本内容缓存 */
    BinTool.m_webToolJs = {};
    return BinTool;
}());
exports.default = BinTool;
//# sourceMappingURL=BinTool.js.map