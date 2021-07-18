import MainConfig from "../../config/MainConfig";
import MyConfig from "../../config/MyConfig";
import HttpTool from "../../http/HttpTool";
import ResURL from "../../_T/ResURL";
import VersionsT from "../../_T/VersionsT";
import { join } from "path";
import { readFile } from "fs";
import TemplateT from "../../_T/TemplateT";
import SwT from "../../sw/SwT";
import PackageConfig from "../../config/PackageConfig";

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
            let _jsUrl: string = join(ResURL.publicURL, _url);
            //读取文件
            readFile(_jsUrl, (err, data) => {
                if (err) {
                    r(`没有找到web工具脚本,${_jsUrl}')`);
                    return;
                }
                let _content: string = data.toString();
                //根据不同文件做不同操作
                switch (true) {
                    //主脚本要替换版本，和包信息
                    case new RegExp(`${MyConfig.webToolJsName.main}$`).test(_url):
                        //进过序列化后的字符串必须对"进行转义处理
                        _content = TemplateT.ReplaceVariable(_content, {
                            version: VersionsT.getV(),
                            mainURL: `http://${HttpTool.getHostname}:${MainConfig.config.port.src}`,
                            swURL: SwT.swURL,
                            webSocketUrl: `ws://${HttpTool.getHostname}:${MyConfig.webSocketPort}`,
                            ifUpdateNow: Boolean(MainConfig.config.ifUpdateNow).toString(),
                            packageJson: JSON.stringify({
                                name: PackageConfig.package.name,
                                version: PackageConfig.package.version,
                                authorName: PackageConfig.package.authorName,
                                description: PackageConfig.package.description,
                                repository: PackageConfig.package.repository,
                                remotePackgeJsonFileUrl: PackageConfig.package.remotePackgeJsonFileUrl,
                                remotePackgeVersionJsonFileUrl: PackageConfig.package.remotePackgeVersionJsonFileUrl,
                            }).replace(/"/g, '\\"'),
                        });
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
            let _htmlUrl: string = join(MainConfig.config.bin, MainConfig.config.homePage);
            readFile(_htmlUrl, (err, data) => {
                if (err) {
                    r('没有找到主页html文件' + _htmlUrl);
                    return;
                }
                _html = data.toString();
                //在头部结束时加上css样式表和serviceWorkers工具脚本
                _html = _html.replace(/\<\/head\>/, `
<link rel="stylesheet" type="text/css" href="${ResURL.publicResURL}${MyConfig.webToolJsName.css}">
<script type="text/javascript" src="${ResURL.publicSrcURL}${MyConfig.webToolJsName.main}"></script>
<script type="text/javascript" src="${ResURL.publicSrcURL}${MyConfig.webToolJsName.swTool}"></script>
<script type="text/javascript" src="${ResURL.publicSrcURL}${MyConfig.webToolJsName.webSocket}"></script>
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
                //添加提示
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
            let _jsUrl: string = join(MainConfig.config.bin, MainConfig.config.homeJs);
            readFile(_jsUrl, (err, data) => {
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