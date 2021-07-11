import { IFileModuleContent } from "../../com/FileModule";
import chalk from "chalk";
import path from "path";
import { transform, TransformOptions, TransformResult } from "esbuild";
import { readFile } from "fs";
import MainConfig from "../../config/MainConfig";
import { LoaderHandle } from "./SrcLoader";
import BufferT from "../../_T/BufferT";

/** 匹配后缀的正则 */
const matchSu: RegExp = /[a-z]*$/;
const extractSu: RegExp = /^\./;

/**
 * 文件打包
 * 读取目标文件，然后按照配置的打包规则一步一步获取到最终结果
 * @param _url 模块路径，绝对路径
 */
export async function FileBuild(_url: string): Promise<IFileModuleContent> {
    let _data: { err?: any, data?: any };
    let __url: string;
    let _sus: string[] = MainConfig.config.srcFileDefaultSuffixs;
    let _su: string;
    //按照默认的后缀依次读取文件，直到读取到目标文件
    for (let _i in _sus) {
        _su = _sus[_i];
        if (_su) {
            __url = `${_url}.${_su}`;
            //注意su里面可能还有带后缀的结构
            _su = _su.match(matchSu)[0];
        } else {
            __url = _url;
            //这里注意要去掉首字符的.符号，这里可能会出现没有后缀的情况，所以这里用系统的获取后缀的方法
            _su = path.extname(__url).replace(extractSu, '');
        }
        //获取文件
        _data = await _readFile(__url);
        //判断是否有错误发生
        if (_data.err) {
            //如果没有遍历完成则再次遍历
            if (Number(_i) < _sus.length - 1) {
                continue;
            }
            //去不后缀都没匹配到目标文件，则直接报错
            throw `读取文件失败！@${__url}`;
        } else {
            //获取目标文件内容，开始打包
            return await _fileBuild(__url, _su, _data.data.toString());
        }
    }
}

/** esbuildTransfor选项 */
let _esbuildTransformOptions: TransformOptions = {
    //装载器
    loader: null,
    //使用资源映射
    sourcemap: true,
    //资源文件，将会显示到资源管理器里面，通过webpack协议来自定义源
    sourcefile: null,
    //字符集
    charset: 'utf8',
    //
};

/**
 * 配合打包
 * @param _url 地址
 * @param _suffix 后缀
 * @param _code 代码内容
 */
function _fileBuild(_url: string, _suffix: string, _code: string): Promise<IFileModuleContent> {
    // console.log(_url, _suffix);
    return new Promise((r, e) => {
        //文件名字
        let _fileName: string = path.basename(_url);
        //相对目录，且文件分隔符必须为/
        let _relativeUrl: string = _url.replace(path.join(MainConfig.config.src, '/'), '').replace(/\\/g, '/');
        //判断后缀，js|ts的文件就用esbuild先编译
        // console.log('构建', _url, _suffix);
        if (/^(ts|js)$/.test(_suffix)) {
            //设置tuansform选项内容
            _esbuildTransformOptions.loader = _suffix as any;
            _esbuildTransformOptions.sourcefile = `webpack://🗂️src✔️/${_relativeUrl} ✔`;
            //使用esbuild编译
            transform(_code, _esbuildTransformOptions)
                .then(({ code, map, warnings }: TransformResult) => {
                    //判断是否有警告
                    if (warnings.length > 0) {
                        warnings.forEach((item) => {
                            console.log(chalk.gray(item.toString()));
                        });
                    }
                    // console.log(_url, _suffix, map);
                    //返回内容，全部转成buffer格式的数据
                    _fileBuildRProxy(r, _url, _suffix, code + `//# sourceMappingURL=${_fileName}.map`, Buffer.from(map));
                }).catch((E) => {
                    // console.log(E);
                    e(E['errors']);
                });
        }
        //打包成普通文本
        else {
            _fileBuildRProxy(r, _url, _suffix, _code, BufferT.nullBuffer);
        }
    });
}

/**
 * 文件编译中异步函数的r函数代理
 * 在处理真正的r函数前，需要调用用户配置的loader链
 * @param _r 真正的r函数
 * @param _url 地址
 * @param _suffix 后缀
 * @param _code 代码
 * @param _map 代码map
 */
function _fileBuildRProxy(_r: (_: IFileModuleContent) => void, _url: string, _suffix: string, _code: string, _map: Buffer) {
    // console.log(_map.toString());
    if (MainConfig.config.loader && MainConfig.config.loader.length > 0) {
        //loader处理
        LoaderHandle(MainConfig.config.loader, _code, _url, _suffix)
            .then((data) => {
                _r({
                    code: Buffer.from(data),
                    map: _map,
                });
            })
            .catch((err) => {
                // console.log('loader打包错误', err);
                //
                _r({
                    code: BufferT.nullBuffer,
                    map: BufferT.nullBuffer,
                });
            });
    } else {
        _r({
            code: Buffer.from(_code),
            map: _map,
        });
    }
}

/**
 * 读取文件，结果会全部成功，并返回一个包含错误或者文件内容的对象
 * @param _url 文件地址
 */
function _readFile(_url: string): Promise<{ err?: any, data?: any }> {
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