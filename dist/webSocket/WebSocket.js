"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MyConfig_1 = __importDefault(require("../config/MyConfig"));
var HttpTool_1 = __importDefault(require("../http/HttpTool"));
var ws_1 = __importDefault(require("ws"));
var PortTool_1 = __importDefault(require("../http/PortTool"));
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
        var _this_1 = this;
        //自动分配端口
        return PortTool_1.default.getPool('webSocket')
            .then(function (port) {
            MyConfig_1.default.webSocketPort = port;
            // 实例化:
            var _wss = new ws_1.default.Server({
                //主机
                host: HttpTool_1.default.getHostname,
                //端口
                port: MyConfig_1.default.webSocketPort,
            });
            //监听连接
            _wss.on('connection', function (ws) {
                _this_1.m_wss.add(ws);
                //监听关闭
                ws.on('close', function () {
                    _this_1.m_wss.delete(ws);
                });
                //监听消息
                ws.on('message', function (event) {
                    var _a = JSON.parse(event), type = _a.type, mes = _a.mes;
                    _this_1.m_mesBackList.forEach(function (f) {
                        f.back.call(f.this, type, mes);
                    });
                });
            });
        });
    };
    /**
     * 添加监听
     * @param _this 执行域
     * @param _back 回调
     */
    WebSocket.addMesBack = function (_this, _back) {
        this.m_mesBackList.push({
            this: _this,
            back: _back,
        });
    };
    /**
     * 删除消息监听
     * @param _this 执行域
     * @param _back 执行回调
     */
    WebSocket.remoteMesBack = function (_this, _back) {
        this.m_mesBackList = this.m_mesBackList.filter(function (item) {
            return !(item.this == _this && (_back ? item.back == _back : true));
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
    /** 消息回调列表 */
    WebSocket.m_mesBackList = [];
    return WebSocket;
}());
exports.default = WebSocket;
//# sourceMappingURL=WebSocket.js.map