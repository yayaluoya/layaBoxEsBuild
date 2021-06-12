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
var HttpTool_1 = __importDefault(require("../../http/HttpTool"));
var SrcOperation_1 = __importDefault(require("./SrcOperation"));
var WebSocket_1 = __importDefault(require("../../webSocket/WebSocket"));
var EWebSocketMesType_1 = require("../../webSocket/EWebSocketMesType");
/**
 * src代理
 */
var SrcProxy = /** @class */ (function () {
    function SrcProxy() {
    }
    /**
     * 开始
     */
    SrcProxy.start = function () {
        //head
        var _head = {
            'Content-Type': 'application/javascript;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE',
            'Access-Control-Expose-Headers': 'Content-Type,*',
            'cache-control': 'no-cache', //协商缓存
        };
        //打开webScoket模拟响应
        WebSocket_1.default.addMesBack(null, function (type, _mes) {
            if (type == EWebSocketMesType_1.EWebSocketMesType.fetch) {
                var _a = _mes, url = _a.url, key_1 = _a.key;
                //获取文件
                SrcOperation_1.default.getFile({ url: url }).then(function (_fileData) {
                    WebSocket_1.default.send({
                        key: key_1,
                        stateCode: _fileData.stateCode,
                        body: _fileData.content.toString(),
                        head: __assign(__assign({}, _head), _fileData.resHead),
                    }, EWebSocketMesType_1.EWebSocketMesType.fetch);
                });
            }
        });
        // req 请求， res 响应 
        return HttpTool_1.default.createServer(function (req, res) {
            //get请求
            switch (req.method) {
                case 'GET':
                    //
                    SrcOperation_1.default.getFile(req).then(function (_fileData) {
                        //
                        res.writeHead(_fileData.stateCode, __assign(__assign({}, _head), _fileData.resHead));
                        //返回数据
                        res.end(_fileData.content);
                    });
                    break;
                case 'POST':
                    res.end('不支持post请求。');
                    return;
            }
        }, MainConfig_1.default.config.port.src).then(function (server) {
            //重置scr目录服务代理端口
            MainConfig_1.default.config.port.src = server.address().port;
        });
    };
    /**
     * 获取主页地址
     */
    SrcProxy.getHomePage = function () {
        return '';
    };
    return SrcProxy;
}());
exports.default = SrcProxy;
//# sourceMappingURL=SrcProxy.js.map