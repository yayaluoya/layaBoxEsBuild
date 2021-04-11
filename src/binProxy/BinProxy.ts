import ContentType from "../com/ContentType";
import MainConfig from "../config/MainConfig";
import MyConfig from "../config/MyConfig";
import HttpTool from "../http/HttpTool";
import URLT from "../_T/URLT";
import BinTool from "./BinTool";

const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * bin目录代理
 */
export default class BinProxy {
    /**
     * 开始
     */
    public static start() {
        // req 请求， res 响应 
        HttpTool.createServer((req, res) => {
            //head
            let _head = {
                'Content-Type': 'application/javascript;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',//跨域
                'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE',//跨域
            };
            //get请求
            if (req.method === 'GET') {
                //获取地址
                let _url: string = URLT.join(MainConfig.config.bin, req.url);
                //主页
                if (new RegExp(`^((/?)|(/?${MainConfig.config.homePage.replace(/^\//, '')}))$`).test(req.url)) {
                    res.writeHead(200, {
                        ..._head,
                        'Content-Type': ContentType.get('.html'),
                    });
                    BinTool.getHomePage().then((_html) => {
                        res.end(_html);
                    });
                }
                //主页脚本文件
                else if (new RegExp(`^/?${MainConfig.config.homeJs.replace(/^\//, '')}$`).test(req.url)) {
                    res.writeHead(200, {
                        ..._head,
                        'Content-Type': ContentType.get('.js'),
                    });
                    BinTool.getHomeJs().then((_js) => {
                        res.end(_js);
                    });
                }
                //webSocked工具脚本
                else if (new RegExp(`^/?${MyConfig.webSocketToolJsName.replace(/^\//, '')}$`).test(req.url)) {
                    res.writeHead(200, {
                        ..._head,
                        'Content-Type': ContentType.get('.js'),
                    });
                    BinTool.getWebSocketToolJs().then((_js) => {
                        res.end(_js);
                    });
                }
                //其他文件
                else {
                    //处理特殊字符
                    // _url = _url.replace(/%2B/g, '+');
                    // _url = _url.replace(/%20/g, ' ');
                    // _url = _url.replace(/%2F/g, '/');
                    // _url = _url.replace(/%3F/g, '?');
                    // _url = _url.replace(/%25/g, '%');
                    // _url = _url.replace(/%23/g, '#');
                    // _url = _url.replace(/%26/g, '&');
                    // _url = _url.replace(/%3D/g, '=');
                    //url解码
                    _url = decodeURI(_url);
                    //判断是否有这个文件
                    fs.stat(_url, (err, stats) => {
                        if (err || !stats.isFile()) {
                            res.writeHead(404, _head);
                            res.end();
                            return;
                        }
                        res.writeHead(200, {
                            ..._head,
                            'Content-Type': ContentType.get(path.extname(_url)) || '',
                        });
                        //
                        fs.createReadStream(_url).pipe(res);
                    });
                }
            }
            //post请求
            else if (req.method === 'POST') {
                //
                res.end('不支持post请求。');
            }
        }, MainConfig.config.port.bin);
    }

    /**
     * 获取主页地址
     */
    public static getHomePage(): string {
        return `http://${HttpTool.getHostname}:${MainConfig.config.port.bin}`;
    }
}