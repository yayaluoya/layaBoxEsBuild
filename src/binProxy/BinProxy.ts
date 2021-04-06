import ContentType from "../com/ContentType";
import MainConfig from "../config/MainConfig";
import MyConfig from "../config/MyConfig";
import ResURL from "../_T/ResURL";
import URLT from "../_T/URLT";

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
        http.createServer((req, res) => {
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
                //
                if (req.url == '' || req.url == '/') {
                    res.writeHead(200, {
                        ..._head,
                        'Content-Type': ContentType.get('.html'),
                    });
                    this.getHomePage().then((_html) => {
                        res.end(_html);
                    });
                }
                else if (new RegExp(MyConfig.webSocketToolJsName).test(req.url)) {
                    res.writeHead(200, {
                        ..._head,
                        'Content-Type': ContentType.get('.js'),
                    });
                    this.getWebSocketToolJs().then((_js) => {
                        res.end(_js);
                    });
                }
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
        }).listen(MainConfig.config.port.bin);
    }

    /**
     * 获取主页代码
     */
    private static getHomePage(): Promise<string> {
        return new Promise<string>((r) => {
            //读取主页html
            let _html: string;
            let _htmlUrl: string = URLT.join(MainConfig.config.bin, MainConfig.config.homePage);
            fs.readFile(_htmlUrl, (err, data) => {
                if (err) {
                    r('没有找到主页html' + _htmlUrl);
                    return;
                }
                _html = data.toString();
                let _js: string;
                let _jsUrl: string = URLT.join(MainConfig.config.bin, MainConfig.config.homeJs);
                fs.readFile(_jsUrl, (err, data) => {
                    if (err) {
                        r(`alert('没有找到主页js脚本',${_jsUrl}')`);
                        return;
                    }
                    _js = data.toString();
                    //合并html和js
                    _html = _html.replace(/<body>[\s\S]*?<\/body>/, `
                    <body>
<script type="text/javascript">
    //
    function loadLib(url, type = 'text/javascript') {
        var script = document.createElement("script");
        script.async = false;
        script.src = url;
        script.type = type;
        document.body.appendChild(script);
    }
    //替换主脚本地址
    ${_js.replace(new RegExp(`\\(["']${MainConfig.config.mainJs}["']\\)`), `("http://localhost:${MainConfig.config.port.src}/${MainConfig.config.mainTs.replace(/\..*?$/, '')}", 'module')`)}
    ${MainConfig.config.ifOpenWebSocketTool ? `
    //webSocket工具脚本
    loadLib("${MyConfig.webSocketToolJsName}");
    ` : ``
                        }
</script>
                    </body>
                    `);
                    r(_html);
                });
            });
        });
    }

    /** webSocket工具脚本内容缓存 */
    private static m_webSocketToolJs: string;
    /**
     * 获取工具脚本
     */
    private static getWebSocketToolJs(): Promise<string> {
        return new Promise<string>((r) => {
            if (this.m_webSocketToolJs) {
                r(this.m_webSocketToolJs);
                return;
            }
            //读取webSocketjs脚本文件
            let _jsUrl: string = URLT.join(ResURL.publicURL, MyConfig.webSocketToolJsName);
            fs.readFile(_jsUrl, (err, data) => {
                if (err) {
                    r(`alert('没有找到webSocket工具脚本,${_jsUrl}');`);
                    return;
                }
                //存入缓存
                this.m_webSocketToolJs = data.toString();
                r(this.m_webSocketToolJs);
            });
        })
    }
}