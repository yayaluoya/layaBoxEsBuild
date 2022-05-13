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
var BinProxy_1 = __importDefault(require("./dirProxy/bin/BinProxy"));
var MainConfig_1 = __importDefault(require("./config/MainConfig"));
var Init_1 = __importDefault(require("./Init"));
var SrcProxy_1 = __importDefault(require("./dirProxy/src/SrcProxy"));
var chalk_1 = __importDefault(require("chalk"));
var TestMain_1 = __importDefault(require("./_test/TestMain"));
var PackageConfig_1 = __importDefault(require("./config/PackageConfig"));
var openUrl_1 = require("./alert/openUrl");
var esbuild_1 = require("esbuild");
/**
 * layaboxEsbuild构建实例
 */
var layaboxEsbuild = /** @class */ (function () {
    function layaboxEsbuild() {
    }
    /**
     * 开始构建
     */
    layaboxEsbuild.start = function (_config) {
        var _this = this;
        //
        // console.log('配置信息', _config);
        //设置配置数据
        MainConfig_1.default.config = _config;
        //先初始化项目
        Init_1.default.init().then(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //代理src
                    return [4 /*yield*/, SrcProxy_1.default.start()];
                    case 1:
                        //代理src
                        _a.sent();
                        //代理bin
                        return [4 /*yield*/, BinProxy_1.default.start()];
                    case 2:
                        //代理bin
                        _a.sent();
                        //提示bin目录的主页地址
                        console.log(chalk_1.default.gray('---->'));
                        console.log(chalk_1.default.magenta('本地主页:'), chalk_1.default.blue(BinProxy_1.default.getLocalHomePage()), chalk_1.default.green('推荐>更快⚡'));
                        console.log(chalk_1.default.magenta('局域网主页:'), chalk_1.default.blue(BinProxy_1.default.getHomePage()));
                        console.log(chalk_1.default.gray("> " + PackageConfig_1.default.package.name + "@" + PackageConfig_1.default.package.version + " \u5FEB\u6377\u547D\u4EE4:leb"));
                        console.log(chalk_1.default.gray("esbuild\u7248\u672C@" + esbuild_1.version));
                        console.log(chalk_1.default.gray('执行 leb -h 查看帮助或解决bug'));
                        console.log(chalk_1.default.gray('...'));
                        //打开本地主页
                        MainConfig_1.default.config.ifOpenHome && openUrl_1.openUrl(BinProxy_1.default.getLocalHomePage());
                        //测试
                        TestMain_1.default.start();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return layaboxEsbuild;
}());
exports.default = layaboxEsbuild;
//# sourceMappingURL=Main.js.map