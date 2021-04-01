import Config from "src/config/Config";
import SrcOperation from "./SrcOperation";
const http = require('http');

/**
 * src代理
 */
export default class SrcProxy {
    /**
     * 开始
     */
    public static start() {
        // req 请求， res 响应 
        http.createServer((req, res) => {
            //head
            let _head = {
                'Content-Type': 'application/javascript;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',//跨域
                'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE',//跨域
                'cache-control': 'no-cache',//协商缓存
            };
            //get请求
            if (req.method === 'GET') {
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
            }
            //post请求
            else if (req.method === 'POST') {
                //
                res.end('不支持post请求。');
            }
        }).listen(Config.port.src);
    }
}