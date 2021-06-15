import { IFileModuleContent } from "../../com/FileModule";
import BufferT from "../../_T/BufferT";
import SrcTransition from "./SrcTransition";
import chalk from "chalk";
import path from "path";
import { transform, TransformOptions, TransformResult } from "esbuild";
import { readFile } from "fs";
import MainConfig from "../../config/MainConfig";
/**
 * ts文件打包
 */
export default class TsBuild {
    /**
     * 打包
     * @param _url 模块路径，绝对路径
     * @param _suffix 模块后缀
     */
    public static build(_url: string, _suffix: string): Promise<IFileModuleContent> {
        return new Promise<IFileModuleContent>((r, e) => {
            //文件名字
            let _fileName: string = path.basename(_url);
            //相对目录，且文件分隔符必须为/
            let _relativeUrl: string = _url.replace(path.join(MainConfig.config.src, '/'), '').replace(/\\/g, '/');
            //读取目标文件
            readFile(_url, (err, rootCodeBuffer) => {
                if (err) {
                    e(`读取文件失败！@${_url}`);
                } else {
                    let rootCode: string = rootCodeBuffer.toString();
                    //判断后缀
                    if (/^(ts)|(js)$/.test(_suffix)) {
                        //esbuild的transform选项
                        let _transformOptions: TransformOptions = {
                            //装载器
                            loader: _suffix as any,
                            //内联映射
                            sourcemap: true,
                            //资源文件
                            sourcefile: `webpack://🌈Src✔️/${_relativeUrl} ✔`,
                            //字符集
                            charset: 'utf8',
                            //
                        };
                        //使用esbuild打包
                        transform(rootCode, _transformOptions).then(({ code, map, warnings }: TransformResult) => {
                            //文件过渡
                            code = SrcTransition.tsBuildBack(code);//打包后
                            // console.log('esbuild之后的代码', chalk.gray(code.slice(0, 50)));
                            //判断是否有警告
                            if (warnings.length > 0) {
                                warnings.forEach((item) => {
                                    console.log(chalk.gray(item.toString()));
                                });
                            }
                            //返回内容，全部转成buffer格式的数据
                            r({
                                code: Buffer.from(code + `//# sourceMappingURL=${_fileName}.map`),
                                map: Buffer.from(map),
                            });
                        }).catch((E) => {
                            e(E['errors']);
                        });
                    }
                    //打包成普通文本
                    else {
                        let _code: string = SrcTransition.textBuildBack(rootCode);
                        r({
                            code: Buffer.from(_code),
                            map: BufferT.nullBuffer,
                        });
                    }
                }
            });
        });
    }
}