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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileBuild = void 0;
var chalk_1 = __importDefault(require("chalk"));
var path_1 = __importDefault(require("path"));
var esbuild_1 = require("esbuild");
var fs_1 = require("fs");
var MainConfig_1 = __importDefault(require("../../config/MainConfig"));
var SrcLoader_1 = require("./SrcLoader");
var BufferT_1 = __importDefault(require("../../_T/BufferT"));
/** 匹配后缀的正则 */
var matchSu = /[a-z]*$/;
var extractSu = /^\./;
/**
 * 文件打包
 * 读取目标文件，然后按照配置的打包规则一步一步获取到最终结果
 * @param _url 模块路径，绝对路径
 * @param resUrl 请求路径，浏览器请求用的路径
 * @param _updateH 模块更新方法
 */
function FileBuild(_url, resUrl, _updateH) {
    return __awaiter(this, void 0, void 0, function () {
        var _data, __url, _sus, _su, _a, _b, _c, _i, result, backDoorData, result;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _sus = __spreadArray([], MainConfig_1.default.config.srcFileDefaultSuffixs);
                    _a = [];
                    for (_b in _sus)
                        _a.push(_b);
                    _c = 0;
                    _d.label = 1;
                case 1:
                    if (!(_c < _a.length)) return [3 /*break*/, 9];
                    _i = _a[_c];
                    _su = _sus[_i];
                    if (_su) {
                        __url = _url + "." + _su;
                        //注意su里面可能还有带后缀的结构
                        _su = _su.match(matchSu)[0];
                    }
                    else {
                        __url = _url;
                        //这里注意要去掉首字符的.符号，这里可能会出现没有后缀的情况，所以这里用系统的获取后缀的方法
                        _su = path_1.default.extname(__url).replace(extractSu, '');
                    }
                    return [4 /*yield*/, _readFile(__url, resUrl)];
                case 2:
                    //获取文件
                    _data = _d.sent();
                    if (!_data.data) return [3 /*break*/, 4];
                    return [4 /*yield*/, _fileBuild(__url, _su, _data.data.toString())];
                case 3:
                    result = _d.sent();
                    result.ifCache = true;
                    return [2 /*return*/, result];
                case 4:
                    //如果没有遍历完成则再次遍历
                    if (Number(_i) < _sus.length - 1) {
                        return [3 /*break*/, 8];
                    }
                    if (!MainConfig_1.default.config.fileReadBackDoor) return [3 /*break*/, 7];
                    return [4 /*yield*/, MainConfig_1.default.config.fileReadBackDoor(resUrl, _updateH)];
                case 5:
                    backDoorData = _d.sent();
                    if (!backDoorData.data) return [3 /*break*/, 7];
                    return [4 /*yield*/, _fileBuild(backDoorData.url || __url, backDoorData.su || _su, backDoorData.data.toString())];
                case 6:
                    result = _d.sent();
                    result.ifCache = false;
                    return [2 /*return*/, result];
                case 7: 
                //去不后缀都没匹配到目标文件，则直接报错
                throw "\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25\uFF01@" + __url + "\uFF0C\u53EF\u4EE5\u5C1D\u8BD5\u914D\u7F6EfileReadBackDoor\u6765\u8BFB\u53D6\u81EA\u5B9A\u4E49\u7684\u6587\u4EF6";
                case 8:
                    _c++;
                    return [3 /*break*/, 1];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.FileBuild = FileBuild;
/** esbuildTransfor选项 */
var _esbuildTransformOptions = {
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
    return new Promise(function (r, e) {
        //文件名字
        var _fileName = path_1.default.basename(_url);
        //相对目录，且文件分隔符必须为/
        var _relativeUrl = _url.replace(path_1.default.join(MainConfig_1.default.config.src, '/'), '').replace(/\\/g, '/');
        //判断后缀，js|ts的文件就用esbuild先编译
        // console.log('构建', _url, _suffix);
        if (/^(ts|js)$/.test(_suffix)) {
            //设置tuansform选项内容
            _esbuildTransformOptions.loader = _suffix;
            var sourcefile = '';
            switch (MainConfig_1.default.config.breakpointType) {
                case 'vscode':
                    sourcefile = _url;
                    break;
                case 'browser':
                    sourcefile = "webpack://\uD83D\uDDC2\uFE0Fsrc\u2714\uFE0F/" + _relativeUrl + " \u2714";
                    break;
            }
            //根据全局配置来定
            _esbuildTransformOptions.sourcefile = sourcefile;
            //使用esbuild编译
            esbuild_1.transform(_code, _esbuildTransformOptions)
                .then(function (_a) {
                var code = _a.code, map = _a.map, warnings = _a.warnings;
                //判断是否有警告
                if (warnings.length > 0) {
                    warnings.forEach(function (item) {
                        console.log(chalk_1.default.gray(item.toString()));
                    });
                }
                // console.log(_url, _suffix, map);
                //返回内容，全部转成buffer格式的数据
                _fileBuildRProxy(r, _url, _suffix, code + ("//# sourceMappingURL=" + _fileName + ".map"), Buffer.from(map));
            }).catch(function (E) {
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
            .then(function (data) {
            _r({
                code: Buffer.from(data),
                map: _map,
            });
        })
            .catch(function (err) {
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
    return new Promise(function (r) {
        // console.log('读取文件', _url, resUrl);
        //读取目标文件
        fs_1.readFile(_url, function (err, rootCodeBuffer) {
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