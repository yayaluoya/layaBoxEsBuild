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
exports.FileBuild = void 0;
var chalk_1 = __importDefault(require("chalk"));
var path_1 = __importDefault(require("path"));
var esbuild_1 = require("esbuild");
var fs_1 = require("fs");
var MainConfig_1 = __importDefault(require("../../config/MainConfig"));
var SrcLoader_1 = require("./SrcLoader");
var BufferT_1 = __importDefault(require("../../_T/BufferT"));
/** ????????????????????? */
var matchSu = /[a-z]*$/;
var extractSu = /^\./;
/**
 * ????????????
 * ???????????????????????????????????????????????????????????????????????????????????????
 * @param _url ???????????????????????????
 */
function FileBuild(_url) {
    return __awaiter(this, void 0, void 0, function () {
        var _data, __url, _sus, _su, _a, _b, _c, _i;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _sus = MainConfig_1.default.config.srcFileDefaultSuffixs;
                    _a = [];
                    for (_b in _sus)
                        _a.push(_b);
                    _c = 0;
                    _d.label = 1;
                case 1:
                    if (!(_c < _a.length)) return [3 /*break*/, 6];
                    _i = _a[_c];
                    _su = _sus[_i];
                    if (_su) {
                        __url = _url + "." + _su;
                        //??????su????????????????????????????????????
                        _su = _su.match(matchSu)[0];
                    }
                    else {
                        __url = _url;
                        //?????????????????????????????????.???????????????????????????????????????????????????????????????????????????????????????????????????
                        _su = path_1.default.extname(__url).replace(extractSu, '');
                    }
                    return [4 /*yield*/, _readFile(__url)];
                case 2:
                    //????????????
                    _data = _d.sent();
                    if (!_data.err) return [3 /*break*/, 3];
                    //???????????????????????????????????????
                    if (Number(_i) < _sus.length - 1) {
                        return [3 /*break*/, 5];
                    }
                    //?????????????????????????????????????????????????????????
                    throw "\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25\uFF01@" + __url;
                case 3: return [4 /*yield*/, _fileBuild(__url, _su, _data.data.toString())];
                case 4: 
                //???????????????????????????????????????
                return [2 /*return*/, _d.sent()];
                case 5:
                    _c++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.FileBuild = FileBuild;
/** esbuildTransfor?????? */
var _esbuildTransformOptions = {
    //?????????
    loader: null,
    //??????????????????
    sourcemap: true,
    //????????????????????????????????????????????????????????????webpack?????????????????????
    sourcefile: null,
    //?????????
    charset: 'utf8',
    //
};
/**
 * ????????????
 * @param _url ??????
 * @param _suffix ??????
 * @param _code ????????????
 */
function _fileBuild(_url, _suffix, _code) {
    // console.log(_url, _suffix);
    return new Promise(function (r, e) {
        //????????????
        var _fileName = path_1.default.basename(_url);
        //??????????????????????????????????????????/
        var _relativeUrl = _url.replace(path_1.default.join(MainConfig_1.default.config.src, '/'), '').replace(/\\/g, '/');
        //???????????????js|ts???????????????esbuild?????????
        // console.log('??????', _url, _suffix);
        if (/^(ts|js)$/.test(_suffix)) {
            //??????tuansform????????????
            _esbuildTransformOptions.loader = _suffix;
            _esbuildTransformOptions.sourcefile = "webpack://\uD83D\uDDC2\uFE0Fsrc\u2714\uFE0F/" + _relativeUrl + " \u2714";
            //??????esbuild??????
            esbuild_1.transform(_code, _esbuildTransformOptions)
                .then(function (_a) {
                var code = _a.code, map = _a.map, warnings = _a.warnings;
                //?????????????????????
                if (warnings.length > 0) {
                    warnings.forEach(function (item) {
                        console.log(chalk_1.default.gray(item.toString()));
                    });
                }
                // console.log(_url, _suffix, map);
                //???????????????????????????buffer???????????????
                _fileBuildRProxy(r, _url, _suffix, code + ("//# sourceMappingURL=" + _fileName + ".map"), Buffer.from(map));
            }).catch(function (E) {
                // console.log(E);
                e(E['errors']);
            });
        }
        //?????????????????????
        else {
            _fileBuildRProxy(r, _url, _suffix, _code, BufferT_1.default.nullBuffer);
        }
    });
}
/**
 * ??????????????????????????????r????????????
 * ??????????????????r???????????????????????????????????????loader???
 * @param _r ?????????r??????
 * @param _url ??????
 * @param _suffix ??????
 * @param _code ??????
 * @param _map ??????map
 */
function _fileBuildRProxy(_r, _url, _suffix, _code, _map) {
    // console.log(_map.toString());
    if (MainConfig_1.default.config.loader && MainConfig_1.default.config.loader.length > 0) {
        //loader??????
        SrcLoader_1.LoaderHandle(MainConfig_1.default.config.loader, _code, _url, _suffix)
            .then(function (data) {
            _r({
                code: Buffer.from(data),
                map: _map,
            });
        })
            .catch(function (err) {
            // console.log('loader????????????', err);
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
 * ?????????????????????????????????????????????????????????????????????????????????????????????
 * @param _url ????????????
 */
function _readFile(_url) {
    return new Promise(function (r) {
        // console.log('????????????', _url);
        //??????????????????
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