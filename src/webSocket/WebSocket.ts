import MyConfig from '../config/MyConfig';
import HttpTool from '../http/HttpTool';
import webSocket from 'ws';
import PortTool from '../http/PortTool';

/**
 * webSocket模块
 */
export default class WebSocket {
    /** ws实例 */
    private static m_wss: Set<any> = new Set();
    /** 消息回调列表 */
    private static m_mesBackList: {
        /** 执行域 */
        this: any;
        /** 回调 */
        back: (type: string, mes: string | object) => void;
    }[] = [];

    /** 获取ws实例 */
    public static get ws(): Set<any> {
        return this.m_wss;
    }

    /**
     * 开始
     */
    public static start(): Promise<void> {
        //自动分配端口
        return PortTool.getPool('webSocket').then((port) => {
            MyConfig.webSocketPort = port;
            // 实例化:
            let _wss = new webSocket.Server({
                //主机
                host: HttpTool.getHostname,
                //端口
                port: MyConfig.webSocketPort,
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
                    let { type, mes } = JSON.parse(event);
                    this.m_mesBackList.forEach((f) => {
                        f.back.call(f.this, type, mes);
                    });
                });
            });
        });
    }

    /**
     * 添加监听
     * @param _this 执行域
     * @param _back 回调
     */
    public static addMesBack(
        _this: any,
        _back: (type: string, mes: string | object) => void,
    ) {
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
    public static remoteMesBack(_this: any, _back?: Function) {
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
    public static send(_mess: string | object, _type: string, _f?: (error) => void) {
        this.m_wss.forEach((item) => {
            item.send(
                JSON.stringify({
                    mes: _mess,
                    type: _type,
                }),
                _f,
            );
        });
    }
}
