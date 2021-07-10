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
exports.Loaders = void 0;
var MainConfig_1 = __importDefault(require("../../config/MainConfig"));
/** 内置loader列表 */
exports.Loaders = {
    /**
     * 路径处理loader
     */
    'path': function (_content, _absolutePath, _suffix) {
        //处理路径
        _content = _content.replace(/import.*?["'](.*?)["'];/g, function (text, $1) {
            var _$1 = $1;
            if (MainConfig_1.default.config.filePathModify && MainConfig_1.default.config.filePathModify.length > 0) {
                for (var _i = 0, _a = MainConfig_1.default.config.filePathModify; _i < _a.length; _i++) {
                    var _o = _a[_i];
                    _$1 = _$1.replace(_o.a, _o.b);
                }
            }
            //
            return text.replace($1, _$1);
        });
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
        var _loaderF, _i, _loaders_1, _loaderConfig, _a, _b, _loader;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _i = 0, _loaders_1 = _loaders;
                    _c.label = 1;
                case 1:
                    if (!(_i < _loaders_1.length)) return [3 /*break*/, 6];
                    _loaderConfig = _loaders_1[_i];
                    if (!_loaderConfig.include.test(_absolutePath)) return [3 /*break*/, 5];
                    _a = 0, _b = _loaderConfig.loader;
                    _c.label = 2;
                case 2:
                    if (!(_a < _b.length)) return [3 /*break*/, 5];
                    _loader = _b[_a];
                    _loaderF = (typeof _loader == 'string') ? exports.Loaders[_loader] : _loader;
                    if (!_loaderF) {
                        return [3 /*break*/, 4];
                    }
                    return [4 /*yield*/, _loaderF(_content, _absolutePath, _suffix)];
                case 3:
                    _content = _c.sent();
                    _c.label = 4;
                case 4:
                    _a++;
                    return [3 /*break*/, 2];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: 
                //
                return [2 /*return*/, _content];
            }
        });
    });
}
exports.default = LoaderHandle;
//# sourceMappingURL=SrcLoader.js.map