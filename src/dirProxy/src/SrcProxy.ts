import MainConfig from "../../config/MainConfig";
import HttpTool from "../../http/HttpTool";
import SrcOperation from "./SrcOperation";
import { AddressInfo } from "net";
import WebSocket from "../../webSocket/WebSocket";
import { EWebSocketMesType } from "../../webSocket/EWebSocketMesType";

/**
 * src代理
 */
export default class SrcProxy {
    /**
     * 开始
     */
    public static start(): Promise<void> {
        //head
        let _head = {
            'Content-Type': 'application/javascript;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',//跨域
            'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE',//跨域
            'Access-Control-Expose-Headers': 'Content-Type,*',//暴露出全部请求头参数
            'cache-control': 'no-cache',//协商缓存
        };
        //打开webScoket模拟响应
        WebSocket.addMesBack(null, (type: string, _mes: object) => {
            if (type == EWebSocketMesType.fetch) {
                let { url, key } = _mes as any;
                //获取文件
                SrcOperation.getFile({ url: url }).then((_fileData) => {
                    WebSocket.send({
                        key: key,
                        stateCode: _fileData.stateCode,
                        body: _fileData.content.toString(),
                        head: {
                            ..._head,
                            ..._fileData.resHead,
                        },
                    }, EWebSocketMesType.fetch);
                });
            }
        });
        // req 请求， res 响应 
        return HttpTool.createServer((req, res) => {
            //get请求
            switch (req.method) {
                case 'GET':
                    //
                    SrcOperation.getFile(req).then((_fileData) => {
                        //
                        res.writeHead(_fileData.stateCode, {
                            ..._head,
                            ..._fileData.resHead
                        });
                        //返回数据
                        res.end(_fileData.content);
                    });
                    break;
                case 'POST':
                    res.end('不支持post请求。');
                    return;
            }
        }, MainConfig.config.port.src).then((server) => {
            //重置scr目录服务代理端口
            MainConfig.config.port.src = (server.address() as AddressInfo).port;
        });
    }

    /**
     * 获取主页地址
     */
    public static getHomePage(): string {
        return '';
    }
}