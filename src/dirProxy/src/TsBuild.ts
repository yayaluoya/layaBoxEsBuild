import { IFileModuleContent } from "../../com/FileModule";
import chalk from "chalk";
import path from "path";
import { transform, TransformOptions, TransformResult } from "esbuild";
import { readFile } from "fs";
import MainConfig from "../../config/MainConfig";
import LoaderHandle from "./SrcLoader";
import BufferT from "../../_T/BufferT";

/**
 * ts文件打包
 */
export default class TsBuild {
    /**
     * 打包文件
     * @param _url 模块路径，绝对路径
     */
    public static async build(_url: string): Promise<IFileModuleContent> {
        let _data: { err?: any, data?: any };
        let __url: string;
        let _sus: string[] = MainConfig.config.srcFileDefaultSuffixs;
        let _su: string;
        for (let _i in _sus) {
            _su = _sus[_i];
            if (_su) {
                __url = `${_url}.${_su}`;
                //注意su里面可能还有带后缀的结构
                _su = _su.match(/[a-z]*$/)[0];
            } else {
                __url = _url;
                //这里注意要去掉首字符的.符号
                _su = path.extname(__url).replace(/^\./, '');
            }
            // console.log('匹配路径', _su, _url, __url);
            //替换后缀查找
            _data = await this.readFile(__url);
            //判断是否有错误发生
            if (_data.err) {
                if (Number(_i) < _sus.length - 1) {
                    continue;
                }
                throw `读取文件失败！@${__url}`;
            } else {
                //正式打包
                return await this._build(__url, _su, _data.data.toString());
            }
        }
    }

    /**
     * 配合打包
     * @param _url 地址
     * @param _suffix 后缀
     * @param _code 代码内容
     */
    private static _build(_url: string, _suffix: string, _code: string): Promise<IFileModuleContent> {
        // console.log(_url, _suffix);
        return new Promise((r, e) => {
            //文件名字
            let _fileName: string = path.basename(_url);
            //相对目录，且文件分隔符必须为/
            let _relativeUrl: string = _url.replace(path.join(MainConfig.config.src, '/'), '').replace(/\\/g, '/');
            //判断后缀
            // console.log('构建', _url, _suffix);
            if (/^(ts|js)$/.test(_suffix)) {
                //esbuild的transform选项
                let _transformOptions: TransformOptions = {
                    //装载器
                    loader: _suffix as any,
                    //内联映射
                    sourcemap: true,
                    //资源文件
                    sourcefile: `webpack://🗂️src✔️/${_relativeUrl} ✔`,
                    //字符集
                    charset: 'utf8',
                    //
                };
                //使用esbuild打包
                transform(_code, _transformOptions).then(({ code, map, warnings }: TransformResult) => {
                    //判断是否有警告
                    if (warnings.length > 0) {
                        warnings.forEach((item) => {
                            console.log(chalk.gray(item.toString()));
                        });
                    }
                    // console.log(_url, _suffix, map);
                    //返回内容，全部转成buffer格式的数据
                    _r(code + `//# sourceMappingURL=${_fileName}.map`, Buffer.from(map));
                }).catch((E) => {
                    // console.log(E);
                    e(E['errors']);
                });
            }
            //打包成普通文本
            else {
                _r(_code, BufferT.nullBuffer);
            }

            /**
             * 包装r函数
             * @param _code 代码
             * @param _map map
             */
            function _r(_code: string, _map: Buffer) {
                // console.log(_map.toString());
                if (MainConfig.config.loader && MainConfig.config.loader.length > 0) {
                    //loader处理
                    LoaderHandle(MainConfig.config.loader, _code, _url, _suffix).then((data) => {
                        r({
                            code: Buffer.from(data),
                            map: _map,
                        });
                    });
                } else {
                    r({
                        code: Buffer.from(_code),
                        map: _map,
                    });
                }
            }
        });
    }

    /**
     * 读取文件
     * @param _url 文件地址
     */
    private static readFile(_url: string): Promise<{ err?: any, data?: any }> {
        return new Promise<{ err?: any, data?: any }>((r) => {
            // console.log('读取文件', _url);
            //读取目标文件
            readFile(_url, (err, rootCodeBuffer) => {
                if (err) {
                    r({
                        err: err,
                    });
                } else {
                    r({
                        data: rootCodeBuffer,
                    });
                }
            });
        });
    }
}