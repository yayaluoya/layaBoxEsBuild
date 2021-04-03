"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MyConfig_1 = require("../config/MyConfig");
const webSocket = require('ws');
/**
 * webSocket模块
 */
class WebSocket {
    /** 获取ws实例 */
    static get ws() {
        return this.m_wss;
    }
    /**
     * 开始
     */
    static start() {
        // 实例化:
        let _wss = new webSocket.Server({
            port: MyConfig_1.default.webSocketPort,
        });
        _wss.on('connection', (ws) => {
            this.m_wss.add(ws);
            //
            ws.on('close', () => {
                this.m_wss.delete(ws);
            });
        });
    }
    /**
     * 发送消息
     * @param _mess 消息内容
     * @param _type 消息类型
     * @param _f 回调
     */
    static send(_mess, _type, _f) {
        this.m_wss.forEach((item) => {
            item.send(JSON.stringify({
                mes: _mess,
                type: _type,
            }), _f);
        });
    }
}
exports.default = WebSocket;
/** ws实例 */
WebSocket.m_wss = new Set();
//# sourceMappingURL=WebSocket.js.map