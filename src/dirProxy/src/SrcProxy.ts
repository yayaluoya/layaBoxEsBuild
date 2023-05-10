import MainConfig from '../../config/MainConfig';
import HttpTool from '../../http/HttpTool';
import SrcOperation from './SrcOperation';
import { AddressInfo } from 'net';
import { cacheOneDayHead } from '../../com/ResHead';
import { server } from './NodeModulesT';

/**
 * src代理
 */

export default class SrcProxy {
    /**
     * 开始
     */
    public static async start(): Promise<void> {
        //开启node_module服务
        await server();
        // 开启代码请求服务
        return HttpTool.createServer((req, res) => {
            //get请求
            switch (req.method) {
                case 'GET':
                    //
                    SrcOperation.getFile(req).then((_fileData) => {
                        //
                        res.writeHead(_fileData.stateCode, {
                            ...cacheOneDayHead,
                            ..._fileData.resHead,
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
