"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MyConfig_1 = __importDefault(require("../config/MyConfig"));
const HttpTool_1 = __importDefault(require("../http/HttpTool"));
const ws_1 = __importDefault(require("ws"));
const PortTool_1 = __importDefault(require("../http/PortTool"));
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
        //自动分配端口
        return PortTool_1.default.getPool('webSocket')
            .then((port) => __awaiter(this, void 0, void 0, function* () {
            MyConfig_1.default.webSocketPort = port;
            // 实例化:
            let _wss = new ws_1.default.Server({
                server: yield HttpTool_1.default.createServer(() => { }, MyConfig_1.default.webSocketPort),
                // //主机
                // host: HttpTool.getHostname,
                // //端口
                // port: MyConfig.webSocketPort,
            });
            //监听连接
            _wss.on('connection', (ws) => {
                this.m_wss.add(ws);
                //监听关闭
                ws.on('close', () => {
                    this.m_wss.delete(ws);
                });
                //监听消息
                ws.on('message', (event) => {
                    let { type, mes } = JSON.parse(event.toString());
                    this.m_mesBackList.forEach((f) => {
                        f.back.call(f.this, type, mes);
                    });
                });
            });
        }));
    }
    /**
     * 添加监听
     * @param _this 执行域
     * @param _back 回调
     */
    static addMesBack(_this, _back) {
        this.m_mesBackList.push({
            this: _this,
            back: _back,
        });
    }
    /**
     * 删除消息监听
     * @param _this 执行域
     * @param _back 执行回调
     */
    static remoteMesBack(_this, _back) {
        this.m_mesBackList = this.m_mesBackList.filter((item) => {
            return !(item.this == _this && (_back ? item.back == _back : true));
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
/** 消息回调列表 */
WebSocket.m_mesBackList = [];
//# sourceMappingURL=WebSocket.js.map