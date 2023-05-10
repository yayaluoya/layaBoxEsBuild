"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MainConfig_1 = __importDefault(require("../../config/MainConfig"));
const HttpTool_1 = __importDefault(require("../../http/HttpTool"));
const ResURL_1 = __importDefault(require("../../_T/ResURL"));
const BinTool_1 = __importDefault(require("./BinTool"));
const path_1 = require("path");
const fs_1 = require("fs");
const mime_1 = __importDefault(require("mime"));
const ResHead_1 = require("../../com/ResHead");
/**
 * bin目录代理
 */
class BinProxy {
    /**
     * 开始
     */
    static start() {
        // req 请求， res 响应
        return HttpTool_1.default.createServer((req, res) => {
            //忽略掉请求后的search和hash值并对特殊字符解码
            let url = decodeURI(req.url.replace(/\?.+/, ''));
            //判断请求类型
            switch (req.method) {
                //get请求
                case 'GET':
                    //web工具脚本
                    if (new RegExp(`^/${ResURL_1.default.publicDirName}`).test(url)) {
                        res.writeHead(200, Object.assign(Object.assign({}, ResHead_1.cacheOneDayHead), { 'Content-Type': mime_1.default.getType(path_1.extname(url)) || '' }));
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
                                res.writeHead(200, Object.assign(Object.assign({}, ResHead_1.crossDomainHead), { 'Content-Type': mime_1.default.getType('html') + ';charset=UTF-8' }));
                                BinTool_1.default.getHomePage().then((_html) => {
                                    res.end(_html);
                                });
                                break;
                            //主页js文件
                            case new RegExp(`^/?${MainConfig_1.default.config.homeJs.replace(/^\//, '')}$`).test(url):
                                res.writeHead(200, Object.assign(Object.assign({}, ResHead_1.crossDomainHead), { 'Content-Type': mime_1.default.getType('js') + ';charset=UTF-8' }));
                                BinTool_1.default.getHomeJs().then((_js) => {
                                    res.end(_js);
                                });
                                break;
                            //其他文件
                            case true:
                                //
                                let _url = path_1.join(MainConfig_1.default.config.bin, url);
                                //判断是否有这个文件
                                fs_1.stat(_url, (err, stats) => {
                                    if (err || !stats.isFile()) {
                                        res.writeHead(404, ResHead_1.crossDomainHead);
                                        res.end();
                                        return;
                                    }
                                    res.writeHead(200, Object.assign(Object.assign({}, ResHead_1.crossDomainHead), { 'Content-Type': mime_1.default.getType(path_1.extname(url)) || '' }));
                                    //
                                    fs_1.createReadStream(_url).pipe(res);
                                });
                                break;
                        }
                    }
                    break;
            }
        }, MainConfig_1.default.config.port.bin).then((server) => {
            //重置bin目录服务代理端口
            MainConfig_1.default.config.port.bin = server.address().port;
        });
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