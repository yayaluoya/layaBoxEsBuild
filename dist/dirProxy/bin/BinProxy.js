"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MainConfig_1 = __importDefault(require("../../config/MainConfig"));
var MyConfig_1 = __importDefault(require("../../config/MyConfig"));
var HttpTool_1 = __importDefault(require("../../http/HttpTool"));
var ResURL_1 = __importDefault(require("../../_T/ResURL"));
var BinTool_1 = __importDefault(require("./BinTool"));
var path_1 = require("path");
var fs_1 = require("fs");
var mime_1 = __importDefault(require("mime"));
/**
 * bin目录代理
 */
var BinProxy = /** @class */ (function () {
    function BinProxy() {
    }
    /**
     * 开始
     */
    BinProxy.start = function () {
        // req 请求， res 响应 
        return HttpTool_1.default.createServer(function (req, res) {
            //head
            var _head = {
                'Content-Type': 'application/javascript;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE', //允许跨域
            };
            //
            var url = req.url;
            //判断请求类型
            switch (req.method) {
                //get请求
                case 'GET':
                    //sw文件
                    if (new RegExp("^/" + MyConfig_1.default.webToolJsName.sw + "$").test(url)) {
                        res.writeHead(200, __assign(__assign({}, _head), { 'Content-Type': mime_1.default.getType('js') }));
                        //提取出相对目录并取出内容
                        BinTool_1.default.getWebTool(path_1.join(ResURL_1.default.publicSrcDirName, url)).then(function (_js) {
                            res.end(_js);
                        });
                    }
                    //web工具脚本
                    else if (new RegExp("^/" + ResURL_1.default.publicDirName).test(url)) {
                        res.writeHead(200, __assign(__assign({}, _head), { 'Content-Type': mime_1.default.getType(path_1.extname(url)) || '' }));
                        //提取出相对目录并取出内容
                        BinTool_1.default.getWebTool(url.replace(new RegExp("^/" + ResURL_1.default.publicDirName), '')).then(function (_js) {
                            res.end(_js);
                        });
                    }
                    //其他内容
                    else {
                        switch (true) {
                            //主页html文件
                            case new RegExp("^((/?)|(/?" + MainConfig_1.default.config.homePage.replace(/^\//, '') + "))$").test(url):
                                res.writeHead(200, __assign(__assign({}, _head), { 'Content-Type': mime_1.default.getType('html') + ';charset=UTF-8' }));
                                BinTool_1.default.getHomePage().then(function (_html) {
                                    res.end(_html);
                                });
                                break;
                            //主页js文件
                            case new RegExp("^/?" + MainConfig_1.default.config.homeJs.replace(/^\//, '') + "$").test(url):
                                res.writeHead(200, __assign(__assign({}, _head), { 'Content-Type': mime_1.default.getType('js') + ';charset=UTF-8' }));
                                BinTool_1.default.getHomeJs().then(function (_js) {
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
                                var _url_1 = decodeURI(path_1.join(MainConfig_1.default.config.bin, url));
                                //判断是否有这个文件
                                fs_1.stat(_url_1, function (err, stats) {
                                    if (err || !stats.isFile()) {
                                        res.writeHead(404, _head);
                                        res.end();
                                        return;
                                    }
                                    res.writeHead(200, __assign(__assign({}, _head), { 'Content-Type': mime_1.default.getType(path_1.extname(url)) || '' }));
                                    //
                                    fs_1.createReadStream(_url_1).pipe(res);
                                });
                                break;
                        }
                    }
                    break;
                //post请求
                case 'POST':
                    //
                    res.end('不支持post请求。');
                    break;
            }
        }, MainConfig_1.default.config.port.bin)
            .then(function (server) {
            //重置bin目录服务代理端口
            MainConfig_1.default.config.port.bin = server.address().port;
        });
    };
    /**
     * 获取本地主页
     */
    BinProxy.getLocalHomePage = function () {
        return "http://localhost:" + MainConfig_1.default.config.port.bin;
    };
    /**
     * 获取主页地址
     */
    BinProxy.getHomePage = function () {
        return "http://" + HttpTool_1.default.getHostname + ":" + MainConfig_1.default.config.port.bin;
    };
    return BinProxy;
}());
exports.default = BinProxy;
//# sourceMappingURL=BinProxy.js.map