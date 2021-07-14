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
exports.nmHost = exports.getNMIndexURL = exports.server = exports.getNMIndexPath = exports.getNMUrl = void 0;
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
var portfinder_1 = __importDefault(require("portfinder"));
var http_1 = __importDefault(require("http"));
var mime_1 = __importDefault(require("mime"));
var MainConfig_1 = __importDefault(require("../../config/MainConfig"));
var HttpTool_1 = __importDefault(require("../../http/HttpTool"));
var ResHead_1 = require("../../com/ResHead");
var rollup_1 = require("rollup");
var plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
var rollup_plugin_commonjs_1 = __importDefault(require("rollup-plugin-commonjs"));
var rollup_plugin_node_polyfills_1 = __importDefault(require("rollup-plugin-node-polyfills"));
var plugin_json_1 = __importDefault(require("@rollup/plugin-json"));
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
 * 根据npm包名获取包入口文件路径
 * @param _name
 */
function getNMIndexPath(_name) {
    var _p = '';
    try {
        //根据当前npm包路径找到包入口文件路径
        _p = require.resolve(_name, { paths: [getNMUrl()] });
    }
    catch (e) {
        console.log(chalk_1.default.red('读取npm包入口文件时出错，可能没有安装这个包，详细错误如下：'));
        console.log(e);
    }
    //提取相对路径
    return _p;
}
exports.getNMIndexPath = getNMIndexPath;
/** npm包缓存文件 */
var _npmPackageCatch = {};
/** nm主机地址 */
var _nmHost = '';
/** rollup入口选项 */
var inputOptions = {
    input: '',
    plugins: [
        rollup_plugin_commonjs_1.default(),
        plugin_json_1.default(),
        rollup_plugin_node_polyfills_1.default(),
        plugin_node_resolve_1.default(),
    ]
};
/** rollup出口选项 */
var outputOptions = {
    name: '',
    format: 'umd',
    sourcemap: false,
};
/**
 * 开启node_modules服务
 */
function server() {
    //
    return portfinder_1.default.getPortPromise().then(function (port) {
        //开启一个局域网服务
        http_1.default.createServer(function (rep, res) {
            //获取包名
            var _name = rep.url.replace(/^[\/\\]/, '');
            //获取模块路径
            var _url = getNMIndexPath(_name);
            switch (rep.method) {
                case 'GET':
                    res.writeHead(200, __assign(__assign({}, ResHead_1.crossDomainHead), { 'Content-Type': mime_1.default.getType('js') + ';charset=UTF-8' }));
                    if (_npmPackageCatch[_name]) {
                        res.end(_npmPackageCatch[_name]);
                        return;
                    }
                    //用rollup打包npm中的包
                    rollup_1.rollup(__assign(__assign({}, inputOptions), { input: _url }))
                        .then(function (bundle) {
                        return bundle.generate(__assign(__assign({}, outputOptions), { name: _name }));
                    })
                        .then(function (_a) {
                        var output = _a.output;
                        //获取打包后的代码
                        var _code = output[0].code;
                        //把改代码存入缓存
                        _npmPackageCatch[_name] = _code;
                        //
                        res.end(_code);
                    })
                        .catch(function (e) {
                        res.writeHead(404, ResHead_1.crossDomainHead);
                        res.end(e);
                        console.log(chalk_1.default.red('打包npm包时出错了，详细错误：'));
                        console.log(e);
                    });
                    //
                    break;
            }
        }).listen(port, HttpTool_1.default.getHostname);
        //设置nm主机地址
        _nmHost = "http://" + HttpTool_1.default.getHostname + ":" + port;
    });
}
exports.server = server;
/**
 * 获取包url
 * @param _name 包名
 */
function getNMIndexURL(_name) {
    return _nmHost + "/" + _name;
}
exports.getNMIndexURL = getNMIndexURL;
/**
 * 获取nm主机地址
 */
function nmHost() {
    return _nmHost;
}
exports.nmHost = nmHost;
//# sourceMappingURL=NodeModulesT.js.map