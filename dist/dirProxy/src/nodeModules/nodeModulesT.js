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
exports.server = exports.getNMIndexPath = exports.getNMUrl = void 0;
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
var portfinder_1 = __importDefault(require("portfinder"));
var http_1 = __importDefault(require("http"));
var mime_1 = __importDefault(require("mime"));
var fs_1 = require("fs");
var ResHead_1 = require("../../../com/ResHead");
var MainConfig_1 = __importDefault(require("../../../config/MainConfig"));
var HttpTool_1 = __importDefault(require("../../../http/HttpTool"));
/** nm路径 */
var _NMUrl;
/**
 * 获取nm路径
 */
function getNMUrl() {
    return _NMUrl || (_NMUrl = path_1.default.join(path_1.default.dirname(MainConfig_1.default.config.src), '/'));
}
exports.getNMUrl = getNMUrl;
/**
 * 根据npm包名获取包入口文件相对路径
 * @param _name
 */
function getNMIndexPath(_name) {
    var _p;
    try {
        //根据当前npm包路径找到包入口文件路径
        _p = require.resolve(_name, { paths: [getNMUrl()] });
    }
    catch (e) {
        console.log(chalk_1.default.red('读取npm包入口文件时出错，可能没有安装这个包，详细错误如下：'));
        console.log(e);
    }
    console.log(getNMUrl(), path_1.default.join(getNMUrl(), 'node_modules/'), _p);
    //获取相对路径
    return _p.replace(path_1.default.join(getNMUrl(), 'node_modules/'), '');
}
exports.getNMIndexPath = getNMIndexPath;
/** nm主机地址 */
var _nmHost = '';
/**
 * 开启node_modules服务
 */
function server() {
    return portfinder_1.default.getPortPromise().then(function (port) {
        //开启一个局域网服务
        http_1.default.createServer(function (rep, res) {
            var _url = rep.url;
            switch (rep.method) {
                case 'GET':
                    //读取文件
                    fs_1.readFile(_url, function (err, rootCodeBuffer) {
                        if (err) {
                            res.writeHead(404, ResHead_1.crossDomainHead);
                            res.end();
                        }
                        else {
                            res.writeHead(200, __assign(__assign({}, ResHead_1.crossDomainHead), { 'Content-Type': mime_1.default.getType('js') }));
                            //处理文件
                            var _content = rootCodeBuffer.toString();
                            res.end(_content);
                        }
                    });
                    break;
            }
        }).listen(port, HttpTool_1.default.getHostname);
        //
        _nmHost = "http://" + HttpTool_1.default.getHostname + ":" + port;
    });
}
exports.server = server;
//# sourceMappingURL=nodeModulesT.js.map