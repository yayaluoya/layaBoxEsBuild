import ContentType from "../../com/ContentType";
import MainConfig from "../../config/MainConfig";
import MyConfig from "../../config/MyConfig";
import HttpTool from "../../http/HttpTool";
import ResURL from "../../_T/ResURL";
import URLT from "../../_T/URLT";
import BinTool from "./BinTool";
const fs = require('fs');
const path = require('path');

/**
 * bin目录代理
 */
export default class BinProxy {
    /**
     * 开始
     */
    public static start(): Promise<void> {
        // req 请求， res 响应 
        return HttpTool.createServer((req, res) => {
            //head
            let _head = {
                'Content-Type': 'application/javascript;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',//允许跨域
                'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE',//允许跨域
            };
            //
            let url: string = req.url;
            //get请求
            if (req.method === 'GET') {
                //sw文件
                if (new RegExp(`^/${MyConfig.webToolJsName.sw}$`).test(url)) {
                    res.writeHead(200, {
                        ..._head,
                        'Content-Type': ContentType.get('.js'),
                    });
                    //提取出相对目录并取出内容
                    BinTool.getWebTool(url).then((_js) => {
                        res.end(_js);
                    });
                }
                //web工具脚本
                else if (new RegExp(`^/${ResURL.publicDirName}`).test(url)) {
                    res.writeHead(200, {
                        ..._head,
                        'Content-Type': ContentType.get(path.extname(url)) || '',
                    });
                    //提取出相对目录并取出内容
                    BinTool.getWebTool((url as string).replace(new RegExp(`^/${ResURL.publicDirName}`), '')).then((_js) => {
                        res.end(_js);
                    });
                }
                //其他内容
                else {
                    switch (true) {
                        //主页html文件
                        case new RegExp(`^((/?)|(/?${MainConfig.config.homePage.replace(/^\//, '')}))$`).test(url):
                            res.writeHead(200, {
                                ..._head,
                                'Content-Type': ContentType.get('.html'),
                            });
                            BinTool.getHomePage().then((_html) => {
                                res.end(_html);
                            });
                            break;
                        //主页js文件
                        case new RegExp(`^/?${MainConfig.config.homeJs.replace(/^\//, '')}$`).test(url):
                            res.writeHead(200, {
                                ..._head,
                                'Content-Type': ContentType.get('.js'),
                            });
                            BinTool.getHomeJs().then((_js) => {
                                res.end(_js);
                            });
                            break;
                        //其他文件
                        case true:
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
                            let _url: string = decodeURI(URLT.join(MainConfig.config.bin, url));
                            //判断是否有这个文件
                            fs.stat(_url, (err, stats) => {
                                if (err || !stats.isFile()) {
                                    res.writeHead(404, _head);
                                    res.end();
                                    return;
                                }
                                res.writeHead(200, {
                                    ..._head,
                                    'Content-Type': ContentType.get(path.extname(url)) || '',
                                });
                                //
                                fs.createReadStream(_url).pipe(res);
                            });
                            break;
                    }
                }
            }
            //post请求
            else if (req.method === 'POST') {
                //
                res.end('不支持post请求。');
            }
        }, MainConfig.config.port.bin)
            .then((server) => {
                //重置bin目录服务代理端口
                MainConfig.config.port.bin = server.address().port;
            });
    }

    /**
     * 获取本地主页
     */
    public static getLocalHomePage(): string {
        return `http://localhost:${MainConfig.config.port.bin}`;
    }

    /**
     * 获取主页地址
     */
    public static getHomePage(): string {
        return `http://${HttpTool.getHostname}:${MainConfig.config.port.bin}`;
    }
}