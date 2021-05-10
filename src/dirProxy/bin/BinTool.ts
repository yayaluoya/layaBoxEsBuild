import MainConfig from "../../config/MainConfig";
import MyConfig from "../../config/MyConfig";
import PackageJson from "../../config/PackageJson";
import HttpTool from "../../http/HttpTool";
import ResURL from "../../_T/ResURL";
import URLT from "../../_T/URLT";
import VersionsT from "../../_T/VersionsT";

const fs = require('fs');

/**
 * bin目录工具
 */
export default class BinTool {
    /** web工具脚本内容缓存 */
    private static m_webToolJs: {
        [_index: string]: string,
    } = {};

    /**
     * 获取web工具内容
     * @param _url 地址
     */
    public static getWebTool(_url: string): Promise<string> {
        return new Promise<string>((r) => {
            if (this.m_webToolJs[_url]) {
                r(this.m_webToolJs[_url]);
                return;
            }
            //获取地址
            let _jsUrl: string = URLT.join(ResURL.publicURL, _url);
            //读取文件
            fs.readFile(_jsUrl, (err, data) => {
                if (err) {
                    r(`没有找到web工具脚本,${_jsUrl}')`);
                    return;
                }
                let _content: string = data.toString();
                //根据不同文件做不同操作
                switch (true) {
                    //主脚本要替换版本，和包信息
                    case new RegExp(`${MyConfig.webToolJsName.main}$`).test(_url):
                        _content = _content.replace('${{v}}', VersionsT.getV()).replace('{{packageJson}}', JSON.stringify({
                            name: PackageJson['name'],
                            version: PackageJson['version'],
                            authorName: PackageJson['authorName'],
                            description: PackageJson['description'],
                            repository: PackageJson['repository'],
                            remotePackgeFileUrl: PackageJson['remotePackgeFileUrl'],
                        }).replace(/"/g, '\"'));
                        break;
                    //webSocket工具脚本需要替换主机名和端口号
                    case new RegExp(`${MyConfig.webToolJsName.webSocket}$`).test(_url):
                        _content = _content.replace('${{hostname}}', HttpTool.getHostname).replace('${{webSocketPort}}', MyConfig.webSocketPort + '');
                        break;
                    //alert工具脚本需要替换是否时刻刷新浏览器的变量
                    case new RegExp(`${MyConfig.webToolJsName.alert}$`).test(_url):
                        _content = _content.replace('$ifUpdateNow', Boolean(MainConfig.config.ifUpdateNow).toString());
                        break;
                }
                //存入缓存
                this.m_webToolJs[_url] = _content;
                //
                r(_content);
            });
        });
    }

    /**
     * 获取主页代码
     */
    public static getHomePage(): Promise<string> {
        return new Promise<string>((r) => {
            //读取主页html
            let _html: string;
            let _htmlUrl: string = URLT.join(MainConfig.config.bin, MainConfig.config.homePage);
            fs.readFile(_htmlUrl, (err, data) => {
                if (err) {
                    r('没有找到主页html文件' + _htmlUrl);
                    return;
                }
                _html = data.toString();
                //在头部结束时加上css样式表和serviceWorkers工具脚本
                _html = _html.replace(/\<\/head\>/, `
<link rel="stylesheet" type="text/css" href="${ResURL.publicResURL}${MyConfig.webToolJsName.css}">
<script type="text/javascript" src="${ResURL.publicSrcURL}${MyConfig.webToolJsName.main}"></script>
<script type="text/javascript" src="${ResURL.publicSrcURL}${MyConfig.webToolJsName.webSocket}"></script>
<script type="text/javascript" src="${ResURL.publicSrcURL}${MyConfig.webToolJsName.swTool}"></script>
${MainConfig.config.ifOpenWebSocketTool ? `<script type="text/javascript" src="${ResURL.publicSrcURL}${MyConfig.webToolJsName.alert}"></script>` : ''}
</head>
                `);
                //在所有脚本前加上webload脚本
                _html = _html.replace(/\<body\>/, `<body>
<script type="text/javascript" src="${ResURL.publicSrcURL}${MyConfig.webToolJsName.load}"></script>
                `);
                //包装loadLib函数内容，加一个模块的参数
                _html = _html.replace(/function loadLib\([\s\S]*?\)[\s]\{[\s\S]*?\}/, `
    function loadLib(url) {
        var type = arguments.length <= 1 || arguments[1] === undefined ? 'text/javascript' : arguments[1];
        var script = document.createElement("script");
        script.async = false;
        script.src = url;
        script.type = type;
        document.body.appendChild(script);
    }
                    `);
                //
                _html = `
<!-- 此文件被包装过，和源文件内容有差异。 -->
${_html}
                `;
                //
                r(_html);
            });
        });
    }

    /**
     * 获取主页脚本文件内容
     */
    public static getHomeJs(): Promise<string> {
        return new Promise<string>((r) => {
            let _js: string;
            let _jsUrl: string = URLT.join(MainConfig.config.bin, MainConfig.config.homeJs);
            fs.readFile(_jsUrl, (err, data) => {
                if (err) {
                    r(`alert('没有找到主页js脚本',${_jsUrl}')`);
                    return;
                }
                _js = data.toString();
                //替换主脚本地址
                _js = `
//! 此文件被包装过，和源文件内容有差异。
${_js.replace(new RegExp(`\\(["']/?${MainConfig.config.mainJs.replace(/^\//, '')}["']\\)`), `("http://${HttpTool.getHostname}:${MainConfig.config.port.src}/${MainConfig.config.mainTs.replace(/\..*?$/, '')}", 'module')`)}
                `;
                //
                r(_js);
            });
        });
    }
}