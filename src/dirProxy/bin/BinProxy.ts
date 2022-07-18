import MainConfig from "../../config/MainConfig";
import HttpTool from "../../http/HttpTool";
import ResURL from "../../_T/ResURL";
import BinTool from "./BinTool";
import { join, extname } from "path";
import { createReadStream, stat } from "fs";
import mime from "mime";
import { AddressInfo } from "net";
import { crossDomainHead, cacheOneDayHead } from "../../com/ResHead";

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
            //忽略掉请求后的search和hash值并对特殊字符解码
            let url: string = decodeURI(req.url.replace(/\?.+/, ''));
            //判断请求类型
            switch (req.method) {
                //get请求
                case 'GET':
                    //web工具脚本
                    if (new RegExp(`^/${ResURL.publicDirName}`).test(url)) {
                        res.writeHead(200, {
                            ...cacheOneDayHead,
                            'Content-Type': mime.getType(extname(url)) || '',
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
                                    ...crossDomainHead,
                                    'Content-Type': mime.getType('html') + ';charset=UTF-8',
                                });
                                BinTool.getHomePage().then((_html) => {
                                    res.end(_html);
                                });
                                break;
                            //主页js文件
                            case new RegExp(`^/?${MainConfig.config.homeJs.replace(/^\//, '')}$`).test(url):
                                res.writeHead(200, {
                                    ...crossDomainHead,
                                    'Content-Type': mime.getType('js') + ';charset=UTF-8',
                                });
                                BinTool.getHomeJs().then((_js) => {
                                    res.end(_js);
                                });
                                break;
                            //其他文件
                            case true:
                                //
                                let _url: string = join(MainConfig.config.bin, url);
                                //判断是否有这个文件
                                stat(_url, (err, stats) => {
                                    if (err || !stats.isFile()) {
                                        res.writeHead(404, crossDomainHead);
                                        res.end();
                                        return;
                                    }
                                    res.writeHead(200, {
                                        ...crossDomainHead,
                                        'Content-Type': mime.getType(extname(url)) || '',
                                    });
                                    //
                                    createReadStream(_url).pipe(res);
                                });
                                break;
                        }
                    }
                    break;
            }
        }, MainConfig.config.port.bin).then((server) => {
            //重置bin目录服务代理端口
            MainConfig.config.port.bin = (server.address() as AddressInfo).port;
        });
    }

    /**
     * 获取本地主页
     */
    public static getLocalHomePage(): string {
        return `https://localhost:${MainConfig.config.port.bin}`;
    }

    /**
     * 获取主页地址
     */
    public static getHomePage(): string {
        return `https://${HttpTool.getHostname}:${MainConfig.config.port.bin}`;
    }
}