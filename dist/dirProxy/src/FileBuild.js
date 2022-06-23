"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileBuild = void 0;
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const esbuild_1 = require("esbuild");
const fs_1 = require("fs");
const MainConfig_1 = __importDefault(require("../../config/MainConfig"));
const SrcLoader_1 = require("./SrcLoader");
const BufferT_1 = __importDefault(require("../../_T/BufferT"));
const ObjectUtils_1 = require("yayaluoya-tool/dist/ObjectUtils");
/** 匹配后缀的正则 */
const matchSu = /[a-z]*$/;
const extractSu = /^\./;
/**
 * 文件打包
 * 读取目标文件，然后按照配置的打包规则一步一步获取到最终结果
 * @param _url 模块路径，绝对路径
 * @param resUrl 请求路径，浏览器请求用的路径
 * @param _updateH 模块更新方法
 */
function FileBuild(_url, resUrl, _updateH) {
    return __awaiter(this, void 0, void 0, function* () {
        let _data;
        let __url;
        let _sus = [...MainConfig_1.default.config.srcFileDefaultSuffixs];
        let _su;
        //按照默认的后缀依次读取文件，直到读取到目标文件
        for (let _i in _sus) {
            _su = _sus[_i];
            if (_su) {
                __url = `${_url}.${_su}`;
                //注意su里面可能还有带后缀的结构
                _su = _su.match(matchSu)[0];
            }
            else {
                __url = _url;
                //这里注意要去掉首字符的.符号，这里可能会出现没有后缀的情况，所以这里用系统的获取后缀的方法
                _su = path_1.default.extname(__url).replace(extractSu, '');
            }
            //获取文件
            _data = yield _readFile(__url, resUrl);
            if (_data.data) {
                //打包
                let result = yield _fileBuild(__url, _su, _data.data.toString());
                result.ifCache = true;
                return result;
            }
            else {
                //如果没有遍历完成则再次遍历
                if (Number(_i) < _sus.length - 1) {
                    continue;
                }
                //实在读取不到就判断用户是否还定义了文件读取后门
                if (MainConfig_1.default.config.fileReadBackDoor) {
                    let backDoorData = yield MainConfig_1.default.config.fileReadBackDoor(resUrl, _updateH);
                    if (backDoorData.data) {
                        //打包
                        let result = yield _fileBuild(backDoorData.url || __url, backDoorData.su || _su, backDoorData.data.toString());
                        result.ifCache = false;
                        return result;
                    }
                }
                //去不后缀都没匹配到目标文件，则直接报错
                throw `读取文件失败！@${__url}，可以尝试配置fileReadBackDoor来读取自定义的文件`;
            }
        }
    });
}
exports.FileBuild = FileBuild;
/** esbuildTransfor选项 */
const EsbuildTransformOptions = {
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
function _fileBuild(_url, _suffix, _code) {
    // console.log(_url, _suffix);
    return new Promise((r, e) => {
        //文件名字
        let _fileName = path_1.default.basename(_url);
        //相对目录，且文件分隔符必须为/
        let _relativeUrl = _url.replace(path_1.default.join(MainConfig_1.default.config.src, '/'), '').replace(/\\/g, '/');
        //判断后缀，js|ts的文件就用esbuild先编译
        // console.log('构建', _url, _suffix);
        if (/^(ts|js)$/.test(_suffix)) {
            //设置tuansform选项内容
            let _esbuildTransformOptions = ObjectUtils_1.ObjectUtils.clone_(EsbuildTransformOptions);
            _esbuildTransformOptions.loader = _suffix;
            let sourcefile = '';
            switch (MainConfig_1.default.config.breakpointType) {
                case 'vscode':
                    sourcefile = _url;
                    break;
                case 'browser':
                    sourcefile = `webpack://🗂️src✔️/${_relativeUrl} ✔`;
                    break;
            }
            //根据全局配置来定
            _esbuildTransformOptions.sourcefile = sourcefile;
            //使用esbuild编译，如果配置了confing的组合方式就组合一下
            esbuild_1.transform(_code, MainConfig_1.default.config.comEsbuildConfig ? MainConfig_1.default.config.comEsbuildConfig(_esbuildTransformOptions) : _esbuildTransformOptions)
                .then(({ code, map, warnings }) => {
                //判断是否有警告
                if (warnings.length > 0) {
                    warnings.forEach((item) => {
                        console.log(chalk_1.default.gray(item.toString()));
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
            _fileBuildRProxy(r, _url, _suffix, _code, BufferT_1.default.nullBuffer);
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
function _fileBuildRProxy(_r, _url, _suffix, _code, _map) {
    // console.log(_map.toString());
    if (MainConfig_1.default.config.loader && MainConfig_1.default.config.loader.length > 0) {
        //loader处理
        SrcLoader_1.LoaderHandle(MainConfig_1.default.config.loader, _code, _url, _suffix)
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
                code: BufferT_1.default.nullBuffer,
                map: BufferT_1.default.nullBuffer,
            });
        });
    }
    else {
        _r({
            code: Buffer.from(_code),
            map: _map,
        });
    }
}
/**
 * 读取文件，结果会全部成功，并返回一个包含错误或者文件内容的对象
 * @param _url 文件地址
 * @param resUrl 请求路径，浏览器请求时带的路径
 */
function _readFile(_url, resUrl) {
    return new Promise((r) => {
        // console.log('读取文件', _url, resUrl);
        //读取目标文件
        fs_1.readFile(_url, (err, rootCodeBuffer) => {
            if (err) {
                r({
                    err: err,
                });
            }
            else {
                r({
                    data: rootCodeBuffer,
                });
            }
        });
    });
}
//# sourceMappingURL=FileBuild.js.map