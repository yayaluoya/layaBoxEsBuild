import MainConfig from "../../config/MainConfig";
import HttpTool from "../../http/HttpTool";
import SrcOperation from "./SrcOperation";
import { AddressInfo } from "net";
import { crossDomainHead } from "../../com/ResHead";

/**
 * src代理
 */
//head
/** 公共头部 */
const _head = {
    ...crossDomainHead,
    'cache-control': 'no-cache',//协商缓存
};

export default class SrcProxy {
    /**
     * 开始
     */
    public static start(): Promise<void> {
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