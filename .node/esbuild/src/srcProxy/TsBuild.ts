import Config from "src/config/Config";
import URLT from "src/_T/URLT";
import SrcTransition from "./SrcTransition";
var fs = require("fs");
const esbuild = require('esbuild');

/**
 * ts文件打包
 */
export default class TsBuild {
    /**
     * 打包
     * @param _url 模块相对路径，不包含路径
     * @param _suffix 模块后缀
     */
    public static build(_url: string, _suffix: string): Promise<string> {
        return new Promise<string>((r, e) => {
            //
            try {
                //源url
                let _rootUrl: string = _url;
                _url = URLT.join(Config.src, _rootUrl + '.' + _suffix);
                //读取目标文件
                fs.readFile(_url, (err, rootCode) => {
                    if (err) {
                        console.error(err);
                        e('');
                    } else {
                        rootCode = rootCode.toString();
                        //判断后缀
                        if (_suffix == 'ts' || _url == 'js') {
                            //使用esbuild打包
                            esbuild.transform(rootCode, {
                                //装载器
                                loader: _suffix,
                                //内联映射
                                sourcemap: 'inline',
                                //资源文件
                                sourcefile: _url,
                                //字符集
                                charset: 'utf8',
                                //
                            }).then(({ code, map, warnings }) => {
                                //文件过渡
                                code = SrcTransition.tsBuildBack(code);//打包后
                                // console.log('esbuild之后的代码', chalk.gray(code.slice(0, 50)));
                                if (warnings.length > 0) {
                                    warnings.forEach((item) => {
                                        console.log(item);
                                    });
                                }
                                //返回内容
                                r(code);
                            }).catch((E) => {
                                console.error(E);
                                e('');
                            });
                        }
                        //打包成普通文本
                        else {
                            let _code: string = SrcTransition.textBuildBack(rootCode);
                            r(_code);
                        }
                    }
                });
            } catch (E) {
                console.error(E);
                e('');
            }
        });
    }
}