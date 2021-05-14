"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var BufferT_1 = __importDefault(require("../../_T/BufferT"));
var SrcTransition_1 = __importDefault(require("./SrcTransition"));
var fs = require("fs");
var path = require("path");
var esbuild = require('esbuild');
/**
 * ts文件打包
 */
var TsBuild = /** @class */ (function () {
    function TsBuild() {
    }
    /**
     * 打包
     * @param _url 模块路径，绝对路径
     * @param _suffix 模块后缀
     */
    TsBuild.build = function (_url, _suffix) {
        return new Promise(function (r, e) {
            //文件名字
            var _fileName = path.basename(_url);
            //读取目标文件
            fs.readFile(_url, function (err, rootCode) {
                if (err) {
                    e('读取文件失败！');
                }
                else {
                    rootCode = rootCode.toString();
                    //判断后缀
                    if (/^(ts)|(js)$/.test(_suffix)) {
                        //esbuild的transform选项
                        var _transformOptions = {
                            //装载器
                            loader: _suffix,
                            //内联映射
                            sourcemap: true,
                            //资源文件
                            sourcefile: "./." + _fileName + " \u2714",
                            //字符集
                            charset: 'utf8',
                            //
                        };
                        //使用esbuild打包
                        esbuild.transform(rootCode, _transformOptions).then(function (_a) {
                            var code = _a.code, map = _a.map, warnings = _a.warnings;
                            //文件过渡
                            code = SrcTransition_1.default.tsBuildBack(code); //打包后
                            // console.log('esbuild之后的代码', chalk.gray(code.slice(0, 50)));
                            //判断是否有警告
                            if (warnings.length > 0) {
                                warnings.forEach(function (item) {
                                    console.log(chalk.gray(item.toString()));
                                });
                            }
                            //返回内容，全部转成buffer格式的数据
                            r({
                                code: Buffer.from(code + ("//# sourceMappingURL=" + _fileName + ".map")),
                                map: Buffer.from(map),
                            });
                        }).catch(function (E) {
                            e(E['errors']);
                        });
                    }
                    //打包成普通文本
                    else {
                        var _code = SrcTransition_1.default.textBuildBack(rootCode);
                        r({
                            code: Buffer.from(_code),
                            map: BufferT_1.default.nullBuffer,
                        });
                    }
                }
            });
        });
    };
    return TsBuild;
}());
exports.default = TsBuild;
//# sourceMappingURL=TsBuild.js.map