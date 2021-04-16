"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContentType_1 = require("../../com/ContentType");
const MainConfig_1 = require("../../config/MainConfig");
const MyConfig_1 = require("../../config/MyConfig");
const HttpTool_1 = require("../../http/HttpTool");
const ResURL_1 = require("../../_T/ResURL");
const URLT_1 = require("../../_T/URLT");
const BinTool_1 = require("./BinTool");
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
                'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE', //允许跨域
            };
            //
            let url = req.url;
            //get请求
            if (req.method === 'GET') {
                //sw文件
                if (new RegExp(`^/${MyConfig_1.default.webToolJsName.sw}$`).test(url)) {
                    res.writeHead(200, Object.assign(Object.assign({}, _head), { 'Content-Type': ContentType_1.default.get('.js') }));
                    //提取出相对目录并取出内容
                    BinTool_1.default.getWebTool(url).then((_js) => {
                        res.end(_js);
                    });
                }
                //web工具脚本
                else if (new RegExp(`^/${ResURL_1.default.publicDirName}`).test(url)) {
                    res.writeHead(200, Object.assign(Object.assign({}, _head), { 'Content-Type': ContentType_1.default.get(path.extname(url)) || '' }));
                    //提取出相对目录并取出内容
                    BinTool_1.default.getWebTool(url.replace(new RegExp(`^/${ResURL_1.default.publicDirName}`), '')).then((_js) => {
                        res.end(_js);
                    });
                }
                //其他内容
                else {
                    switch (true) {
                        //主页html文件
                        case new RegExp(`^((/?)|(/?${MainConfig_1.default.config.homePage.replace(/^\//, '')}))$`).test(url):
                            res.writeHead(200, Object.assign(Object.assign({}, _head), { 'Content-Type': ContentType_1.default.get('.html') }));
                            BinTool_1.default.getHomePage().then((_html) => {
                                res.end(_html);
                            });
                            break;
                        //主页js文件
                        case new RegExp(`^/?${MainConfig_1.default.config.homeJs.replace(/^\//, '')}$`).test(url):
                            res.writeHead(200, Object.assign(Object.assign({}, _head), { 'Content-Type': ContentType_1.default.get('.js') }));
                            BinTool_1.default.getHomeJs().then((_js) => {
                                res.end(_js);
                            });
                            break;
                        //其他文件
                        case true:
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
                            let _url = decodeURI(URLT_1.default.join(MainConfig_1.default.config.bin, url));
                            //判断是否有这个文件
                            fs.stat(_url, (err, stats) => {
                                if (err || !stats.isFile()) {
                                    res.writeHead(404, _head);
                                    res.end();
                                    return;
                                }
                                res.writeHead(200, Object.assign(Object.assign({}, _head), { 'Content-Type': ContentType_1.default.get(path.extname(url)) || '' }));
                                //
                                fs.createReadStream(_url).pipe(res);
                            });
                            break;
                    }
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
     * 获取本地主页
     */
    static getLocalHomePage() {
        return `http://localhost:${MainConfig_1.default.config.port.bin}`;
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