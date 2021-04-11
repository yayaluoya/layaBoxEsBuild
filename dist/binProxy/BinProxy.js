"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContentType_1 = require("../com/ContentType");
const MainConfig_1 = require("../config/MainConfig");
const MyConfig_1 = require("../config/MyConfig");
const HttpTool_1 = require("../http/HttpTool");
const URLT_1 = require("../_T/URLT");
const BinTool_1 = require("./BinTool");
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
        HttpTool_1.default.createServer((req, res) => {
            //head
            let _head = {
                'Content-Type': 'application/javascript;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE', //跨域
            };
            //get请求
            if (req.method === 'GET') {
                //获取地址
                let _url = URLT_1.default.join(MainConfig_1.default.config.bin, req.url);
                //主页
                if (new RegExp(`^((/?)|(/?${MainConfig_1.default.config.homePage.replace(/^\//, '')}))$`).test(req.url)) {
                    res.writeHead(200, Object.assign(Object.assign({}, _head), { 'Content-Type': ContentType_1.default.get('.html') }));
                    BinTool_1.default.getHomePage().then((_html) => {
                        res.end(_html);
                    });
                }
                //主页脚本文件
                else if (new RegExp(`^/?${MainConfig_1.default.config.homeJs.replace(/^\//, '')}$`).test(req.url)) {
                    res.writeHead(200, Object.assign(Object.assign({}, _head), { 'Content-Type': ContentType_1.default.get('.js') }));
                    BinTool_1.default.getHomeJs().then((_js) => {
                        res.end(_js);
                    });
                }
                //webSocked工具脚本
                else if (new RegExp(`^/?${MyConfig_1.default.webSocketToolJsName.replace(/^\//, '')}$`).test(req.url)) {
                    res.writeHead(200, Object.assign(Object.assign({}, _head), { 'Content-Type': ContentType_1.default.get('.js') }));
                    BinTool_1.default.getWebSocketToolJs().then((_js) => {
                        res.end(_js);
                    });
                }
                //其他文件
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
        }, MainConfig_1.default.config.port.bin);
    }
    /**
     * 获取主页地址
     */
    static getHomePage() {
        return `http://${HttpTool_1.default.getHostname}:${MainConfig_1.default.config.port.bin}`;
    }
}
exports.default = BinProxy;
//# sourceMappingURL=BinProxy.js.map