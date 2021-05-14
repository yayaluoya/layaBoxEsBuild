"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MyConfig_1 = __importDefault(require("../config/MyConfig"));
var HttpTool_1 = __importDefault(require("../http/HttpTool"));
var ws_1 = __importDefault(require("ws"));
var portfinder_1 = __importDefault(require("portfinder"));
/**
 * webSocket模块
 */
var WebSocket = /** @class */ (function () {
    function WebSocket() {
    }
    Object.defineProperty(WebSocket, "ws", {
        /** 获取ws实例 */
        get: function () {
            return this.m_wss;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 开始
     */
    WebSocket.start = function () {
        var _this = this;
        //自动分配端口
        return portfinder_1.default.getPortPromise()
            .then(function (port) {
            MyConfig_1.default.webSocketPort = port;
            // 实例化:
            var _wss = new ws_1.default.Server({
                //主机
                host: HttpTool_1.default.getHostname,
                //端口
                port: MyConfig_1.default.webSocketPort,
            });
            _wss.on('connection', function (ws) {
                _this.m_wss.add(ws);
                //
                ws.on('close', function () {
                    _this.m_wss.delete(ws);
                });
            });
        });
    };
    /**
     * 发送消息
     * @param _mess 消息内容
     * @param _type 消息类型
     * @param _f 回调
     */
    WebSocket.send = function (_mess, _type, _f) {
        this.m_wss.forEach(function (item) {
            item.send(JSON.stringify({
                mes: _mess,
                type: _type,
            }), _f);
        });
    };
    /** ws实例 */
    WebSocket.m_wss = new Set();
    return WebSocket;
}());
exports.default = WebSocket;
//# sourceMappingURL=WebSocket.js.map