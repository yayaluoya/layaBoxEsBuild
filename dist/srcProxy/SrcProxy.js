"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainConfig_1 = require("../config/MainConfig");
const HttpTool_1 = require("../http/HttpTool");
const SrcOperation_1 = require("./SrcOperation");
/**
 * src代理
 */
class SrcProxy {
    /**
     * 开始
     */
    static start() {
        // req 请求， res 响应 
        HttpTool_1.default.createServer((req, res) => {
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
        }, MainConfig_1.default.config.port.src);
    }
    /**
     * 获取主页地址
     */
    static getHomePage() {
        return '';
    }
}
exports.default = SrcProxy;
//# sourceMappingURL=SrcProxy.js.map