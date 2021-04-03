"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContentType_1 = require("../com/ContentType");
const MyConfig_1 = require("../config/MyConfig");
const main_1 = require("../main");
const ResURL_1 = require("../_T/ResURL");
const URLT_1 = require("../_T/URLT");
const http = require('http');
const fs = require('fs');
const path = require('path');
/**
 * bin目录代理
 */
class BinProxy {
    /**
     * 开始
     */
    static start() {
        // req 请求， res 响应 
        http.createServer((req, res) => {
            //head
            let _head = {
                'Content-Type': 'application/javascript;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE', //跨域
            };
            //get请求
            if (req.method === 'GET') {
                //获取地址
                let _url = URLT_1.default.join(main_1.default.config.bin, req.url);
                //
                if (req.url == '' || req.url == '/') {
                    res.writeHead(200, Object.assign(Object.assign({}, _head), { 'Content-Type': ContentType_1.default.get('.html') }));
                    this.getHomePage().then((_html) => {
                        res.end(_html);
                    });
                }
                else if (new RegExp(MyConfig_1.default.webSocketToolJsName).test(req.url)) {
                    res.writeHead(200, Object.assign(Object.assign({}, _head), { 'Content-Type': ContentType_1.default.get('.js') }));
                    this.getWebSocketToolJs().then((_js) => {
                        res.end(_js);
                    });
                }
                else {
                    //处理特殊字符
                    // _url = _url.replace(/%2B/g, '+');
                    // _url = _url.replace(/%20/g, ' ');
                    // _url = _url.replace(/%2F/g, '/');
                    // _url = _url.replace(/%3F/g, '?');
                    // _url = _url.replace(/%25/g, '%');
                    // _url = _url.replace(/%23/g, '#');
                    // _url = _url.replace(/%26/g, '&');
                    // _url = _url.replace(/%3D/g, '=');
                    //url解码
                    _url = decodeURI(_url);
                    //判断是否有这个文件
                    fs.stat(_url, (err, stats) => {
                        if (err || !stats.isFile()) {
                            res.writeHead(404, _head);
                            res.end();
                            return;
                        }
                        res.writeHead(200, Object.assign(Object.assign({}, _head), { 'Content-Type': ContentType_1.default.get(path.extname(_url)) || '' }));
                        //
                        fs.createReadStream(_url).pipe(res);
                    });
                }
            }
            //post请求
            else if (req.method === 'POST') {
                //
                res.end('不支持post请求。');
            }
        }).listen(main_1.default.config.port.bin);
    }
    /**
     * 获取主页代码
     */
    static getHomePage() {
        return new Promise((r) => {
            //读取主页html
            let _html;
            let _htmlUrl = URLT_1.default.join(main_1.default.config.bin, main_1.default.config.homePage);
            fs.readFile(_htmlUrl, (err, data) => {
                if (err) {
                    r('没有找到主页html' + _htmlUrl);
                    return;
                }
                _html = data.toString();
                let _js;
                let _jsUrl = URLT_1.default.join(main_1.default.config.bin, main_1.default.config.homeJs);
                fs.readFile(_jsUrl, (err, data) => {
                    if (err) {
                        r(`alert('没有找到主页js脚本',${_jsUrl}')`);
                        return;
                    }
                    _js = data.toString();
                    //合并html和js
                    _html = _html.replace(/<body>[\s\S]*?<\/body>/, `
                    <body>
<script type="text/javascript">
    //
    function loadLib(url, type = 'text/javascript') {
        var script = document.createElement("script");
        script.async = false;
        script.src = url;
        script.type = type;
        document.body.appendChild(script);
    }
    //替换主脚本地址
    ${_js.replace(new RegExp(`\\(["']${main_1.default.config.mainJs}["']\\)`), `("http://localhost:${main_1.default.config.port.src}/${main_1.default.config.mainTs.replace(/\..*?$/, '')}", 'module')`)}
    ${main_1.default.config.ifOpenWebSocketTool ? `
    //webSocket工具脚本
    loadLib("${MyConfig_1.default.webSocketToolJsName}");
    ` : ``}
</script>
                    </body>
                    `);
                    r(_html);
                });
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
                r(this.m_webSocketToolJs);
            });
        });
    }
}
exports.default = BinProxy;
//# sourceMappingURL=BinProxy.js.map