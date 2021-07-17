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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaderHandle = void 0;
var chalk_1 = __importDefault(require("chalk"));
var MainConfig_1 = __importDefault(require("../../config/MainConfig"));
var NodeModulesT_1 = require("./NodeModulesT");
var randomstring_1 = __importDefault(require("randomstring"));
/** 匹配代码中的导入语句 */
var importReg = /([\s])?import\s*([\w{}\s,\.\[\]\*]*?)\s*(?:from\s*)?["'](.*?)["'];?/g;
var requireReg = /([\s])?(?:var|let|const|import)?\s*([\w{}\s,\.\[\]\*]*?)\s*=?\s*require\(\s*["'](.*?)['"]\s*\);?/g;
/**
 * 获取导入路径
 * @param _ 占位。。。
 * @param $0 赋值表达式
 * @param $1 路径
 */
function getImportURL(_, $_, $0, $1) {
    //检测是否时npm的包，由字母开头且不是以src/开头
    if (/^[a-zA-Z]/.test($1) && !/^src\//.test($1)) {
        //换成npm服务的地址
        return _getImportURL($_, $0, NodeModulesT_1.getNMIndexURL($1), $1, true);
    }
    //处理路径
    else {
        //通过配置文件中的路径处理规则处理路径
        if (MainConfig_1.default.config.filePathModify && MainConfig_1.default.config.filePathModify.length > 0) {
            for (var _a = 0, _b = MainConfig_1.default.config.filePathModify; _a < _b.length; _a++) {
                var _o = _b[_a];
                $1 = $1.replace(_o.a, _o.b);
            }
        }
        return _getImportURL($_, $0, $1, $1);
    }
}
;
var _asReg = /^\*\s+as\s*/;
var __absolutePath = '';
var __getImportURLNumber_ = 0;
/** 返回最终的模块导入地址 */
function _getImportURL($_, $0, $1, _packageName, _ifNmpPackage) {
    if (_ifNmpPackage === void 0) { _ifNmpPackage = false; }
    if (_ifNmpPackage) {
        var _name_1 = "__" + randomstring_1.default.generate({
            length: 12,
            charset: 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'
        }) + "__" + __getImportURLNumber_++;
        var _ifAs = _asReg.test($0);
        _ifAs && (console.log(chalk_1.default.yellow("\n\u68C0\u6D4B\u5230\u6587\u4EF6@ " + __absolutePath + " \u5BFC\u5165npm\u5305 " + _packageName + " \u65F6\u7528\u5230\u4E86as\u8BED\u6CD5\uFF0C\u672C\u5DE5\u5177\u6682\u4E0D\u652F\u6301\u8BE5\u8BED\u6CD5\u5BFC\u5165npm\u5305\u5462\uFF0C\u8BF7\u6539\u6210\u5E38\u89C4\u8BED\u6CD5\u5BFC\u5165\u3002\n")));
        $0 = $0.replace(_asReg, '').replace(/\s/g, '');
        if ($0) {
            //没有被{}包裹且带有,则需要拆分开
            if (/,/.test($0) && !/^\{.*?\}$/.test($0)) {
                var _$0 = $0;
                $0 = '';
                _$0.split(',').forEach(function (item) {
                    item && ($0 += "const " + item + " = " + _name_1 + ";");
                });
            }
            else {
                $0 = "const " + $0 + " = " + _name_1 + ";";
            }
        }
        return ($_ || '') + "import " + _name_1 + " from \"" + $1 + "\";" + $0 + "//\u26A0\uFE0F \u8FD9\u91CC\u662Fleb\u5DE5\u5177\u7F16\u8BD1\u7684\uFF0C\u4F5C\u8005\u80FD\u529B\u6709\u9650\uFF0C\u53EA\u652F\u6301\u4E00\u4E9B\u5E38\u89C1\u7684\u5BFC\u5165\u5199\u6CD5\u5BFC\u5165npm\u7684\u5305\u5462\uFF0C\u8BF7\u8C05\u89E3\u3002\uD83D\uDE4F\uD83D\uDE4F\uD83D\uDE4F";
    }
    else {
        return ($_ || '') + "import " + ($0 && $0 + " from " || '') + "\"" + $1 + "\";";
    }
}
/** 内置loader列表 */
var Loaders = {
    /**
     * 路径处理loader
     */
    'path': function (_content, _absolutePath, _suffix) {
        __absolutePath = _absolutePath;
        //处理路径，先处理import再处理require
        _content = _content
            .replace(importReg, getImportURL)
            .replace(requireReg, getImportURL);
        //
        return Promise.resolve(_content);
    },
    /**
     * 文本处理插件
     */
    'txt': function (_content, _absolutePath, _suffix) {
        //需要转义反引号 `
        return Promise.resolve("\n    export default `" + _content.replace(/`/, '\\`') + "`;\n            ");
    }
};
/**
 * loader处理
 * @param _loaders loader列表
 * @param _content 内容
 * @param _absolutePath 绝对路径
 * @param _suffix 后缀
 */
function LoaderHandle(_loaders, _content, _absolutePath, _suffix) {
    return __awaiter(this, void 0, void 0, function () {
        var _loaderF, _names, _a, _loaders_1, _loaderConfig, _loop_1, _b, _c, _loader;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = 0, _loaders_1 = _loaders;
                    _d.label = 1;
                case 1:
                    if (!(_a < _loaders_1.length)) return [3 /*break*/, 6];
                    _loaderConfig = _loaders_1[_a];
                    _names = [_loaderConfig.name];
                    if (!_loaderConfig.include.test(_absolutePath)) return [3 /*break*/, 5];
                    _loop_1 = function (_loader) {
                        var __loaderF;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    __loaderF = (typeof _loader == 'string') ? (_names.push(_loader), Loaders[_loader]) : _loader;
                                    if (!__loaderF) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    //包装一下__loaderF方法，主要是在这个loader出错时跳过这个loader
                                    _loaderF = (function () {
                                        var arg = [];
                                        for (var _a = 0; _a < arguments.length; _a++) {
                                            arg[_a] = arguments[_a];
                                        }
                                        return new Promise(function (r, e) {
                                            try {
                                                __loaderF.apply(void 0, arg).then(r)
                                                    .catch(function (err) {
                                                    //loader处理出错了，跳过这个loader并打印粗错消息
                                                    r(_content);
                                                    //
                                                    loaderErrHand(_names, err);
                                                });
                                            }
                                            catch (err) {
                                                //loader出错了，跳过这个loader并给出提示
                                                r(_content);
                                                //
                                                loaderErrHand(_names, err);
                                            }
                                        });
                                    });
                                    return [4 /*yield*/, _loaderF(_content, _absolutePath, _suffix)];
                                case 1:
                                    //处理正真结果
                                    _content = _e.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b = 0, _c = _loaderConfig.loader;
                    _d.label = 2;
                case 2:
                    if (!(_b < _c.length)) return [3 /*break*/, 5];
                    _loader = _c[_b];
                    return [5 /*yield**/, _loop_1(_loader)];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    _b++;
                    return [3 /*break*/, 2];
                case 5:
                    _a++;
                    return [3 /*break*/, 1];
                case 6: 
                //
                return [2 /*return*/, _content];
            }
        });
    });
}
exports.LoaderHandle = LoaderHandle;
/**
 * loader异常处理
 * @param _names loader名字列表
 * @param err 错误
 */
function loaderErrHand(_names, err) {
    var _name = '-> ';
    var _l = _names.length;
    _names.forEach(function (item, _i) {
        _name += "" + item + (_i < _l - 1 ? ' > ' : '');
    });
    //
    console.log(chalk_1.default.red("loader " + _name + " \u6267\u884C\u51FA\u9519\u4E86\uFF0C\u5DF2\u8DF3\u8FC7\u8FD9\u4E2Aloader\u7684\u6267\u884C:"));
    console.log(err);
}
//# sourceMappingURL=SrcLoader.js.map