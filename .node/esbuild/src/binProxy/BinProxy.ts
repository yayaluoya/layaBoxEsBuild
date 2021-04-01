import ContentType from "src/com/ContentType";
import Config from "src/config/Config";
import URLT from "src/_T/URLT";
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
                let _url: string = URLT.join(Config.bin, req.url);
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
        }).listen(Config.port.bin);
    }

    /**
     * 获取主页代码
     */
    private static getHomePage(): Promise<string> {
        return new Promise<string>((r) => {
            //读取主页html
            let _html: string;
            let _htmlUrl: string = URLT.join(Config.bin, Config.homePage);
            fs.readFile(_htmlUrl, (err, data) => {
                if (err) {
                    r('没有找到主页html' + _htmlUrl);
                    return;
                }
                _html = data.toString();
                let _js: string;
                let _jsUrl: string = URLT.join(Config.bin, Config.homeJs);
                fs.readFile(_jsUrl, (err, data) => {
                    if (err) {
                        r('没有找到主页js脚本' + _jsUrl);
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
    ${_js.replace(/loadLib\([\"\']js\/bundle\.js[\"\']\)/, `loadLib("http://localhost:${Config.port.src}/Main", 'module')`)}
</script>
                    </body>
                    `);
                    r(_html);
                });
            });
        });
    }
}