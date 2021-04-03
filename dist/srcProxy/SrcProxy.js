"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
const SrcOperation_1 = require("./SrcOperation");
const http = require('http');
/**
 * src代理
 */
class SrcProxy {
    /**
     * 开始
     */
    static start() {
        // req 请求， res 响应 
        http.createServer((req, res) => {
            //head
            let _head = {
                'Content-Type': 'application/javascript;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE',
                'cache-control': 'no-cache', //协商缓存
            };
            //get请求
            if (req.method === 'GET') {
                //
                SrcOperation_1.default.getFile(req).then((_fileData) => {
                    //
                    res.writeHead(_fileData.stateCode, Object.assign(Object.assign({}, _head), _fileData.resHead));
                    //返回数据
                    res.end(_fileData.content);
                });
            }
            //post请求
            else if (req.method === 'POST') {
                //
                res.end('不支持post请求。');
            }
        }).listen(main_1.default.config.port.src);
    }
}
exports.default = SrcProxy;
//# sourceMappingURL=SrcProxy.js.map