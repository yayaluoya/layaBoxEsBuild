import MyConfig from "../config/MyConfig";
import HttpTool from "../http/HttpTool";
import webSocket from 'ws';
import portfinder from 'portfinder';

/**
 * webSocket模块
 */
export default class WebSocket {
    /** ws实例 */
    private static m_wss: Set<any> = new Set();

    /** 获取ws实例 */
    public static get ws(): Set<any> {
        return this.m_wss;
    }

    /**
     * 开始
     */
    public static start(): Promise<void> {
        //自动分配端口
        return portfinder.getPortPromise()
            .then((port) => {
                MyConfig.webSocketPort = port;
                // 实例化:
                let _wss = new webSocket.Server({
                    //主机
                    host: HttpTool.getHostname,
                    //端口
                    port: MyConfig.webSocketPort,
                });
                _wss.on('connection', (ws) => {
                    this.m_wss.add(ws);
                    //
                    ws.on('close', () => {
                        this.m_wss.delete(ws);
                    });
                });
            });
    }

    /**
     * 发送消息
     * @param _mess 消息内容
     * @param _type 消息类型
     * @param _f 回调
     */
    public static send(_mess: string, _type: string, _f?: (error) => void) {
        this.m_wss.forEach((item) => {
            item.send(JSON.stringify({
                mes: _mess,
                type: _type,
            }), _f);
        });
    }
}