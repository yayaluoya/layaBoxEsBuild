"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var FileModule_1 = __importDefault(require("../../com/FileModule"));
var MainConfig_1 = __importDefault(require("../../config/MainConfig"));
var EWebSocketMesType_1 = require("../../webSocket/EWebSocketMesType");
var WebSocket_1 = __importDefault(require("../../webSocket/WebSocket"));
var TsBuild_1 = __importDefault(require("./TsBuild"));
var moment_1 = __importDefault(require("moment"));
var chalk_1 = __importDefault(require("chalk"));
/**
 * Src模块
 */
var SrcModule = /** @class */ (function (_super) {
    __extends(SrcModule, _super);
    function SrcModule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /** 初始化回调 */
    SrcModule.prototype._init = function () {
        //
        if (MainConfig_1.default.config.ifLog) {
            console.log(chalk_1.default.gray('-> 创建模块'));
            console.log(chalk_1.default.gray(this.absolutePath));
        }
    };
    /**
     * 更新回调
     */
    SrcModule.prototype._update = function () {
        SrcModule.m_updateSum++;
        //
        if (MainConfig_1.default.config.ifLog) {
            console.log(chalk_1.default.gray('>'));
            console.log(chalk_1.default.gray('--> 模块更新'), chalk_1.default.yellow(this.absolutePath));
            console.log(chalk_1.default.gray('x', this.updateNumber), chalk_1.default.magenta('X', SrcModule.m_updateSum), chalk_1.default.blue(moment_1.default(Date.now()).format('HH:mm:ss')));
        }
        //发出脚本更新事件
        WebSocket_1.default.send(this.key, EWebSocketMesType_1.EWebSocketMesType.scriptUpdate);
    };
    /** 更新内容 */
    SrcModule.prototype._updateContent = function () {
        //返回一个esbuild的任务
        return TsBuild_1.default.build(this.absolutePath);
    };
    /** 处理错误回调 */
    SrcModule.prototype._mismanage = function (_e) {
        if (!_e) {
            return '';
        }
        //
        var _mess = [];
        //
        if (typeof _e == 'object' && Array.isArray(_e)) {
            for (var _i = 0, _e_1 = _e; _i < _e_1.length; _i++) {
                var _o = _e_1[_i];
                //拼接vscodeUrl
                //
                _mess.push({
                    text: "\u6587\u4EF6\uFF1A" + this.normPath + "\n\u4F4D\u7F6E\uFF1A" + _o.location.line + ":" + _o.location.column + "\n\u9519\u8BEF\u4EE3\u7801\uFF1A" + _o.location.lineText + "\n\u9519\u8BEF\u4FE1\u606F\uFF1A" + _o.text,
                    vsCodeUrl: "vscode://file/" + escape(this.normPath + ":" + _o.location.line + ":" + _o.location.column),
                });
            }
        }
        else {
            _mess.push({
                text: _e,
                vsCodeUrl: "vscode://file/" + escape(this.normPath),
            });
        }
        //最后的代码
        var _content = '';
        moment_1.default.locale('zh-cn');
        var _time = moment_1.default().format('LLL');
        for (var _a = 0, _mess_1 = _mess; _a < _mess_1.length; _a++) {
            var _mes = _mess_1[_a];
            console.log(chalk_1.default.yellow('esbuild编译错误！'));
            console.log(chalk_1.default.gray(_mes.text));
            console.log(chalk_1.default.gray(_time));
            //这里引入全局定义的函数
            _content += "\n                console.error(...esbuildTool.consoleEx.pack(esbuildTool.consoleEx.getStyle('#eeeeee', 'red'),`esbuild\u7F16\u8BD1\u9519\u8BEF\uFF01\n-\n" + _mes.text + (_mes.vsCodeUrl ? "\n-\n\u5728vscode\u4E2D\u6253\u5F00\uFF1A" + _mes.vsCodeUrl : '') + "\n-\n" + _time + "`));\n            ";
        }
        //
        return _content;
    };
    /** 更新总数 */
    SrcModule.m_updateSum = 0;
    return SrcModule;
}(FileModule_1.default));
exports.default = SrcModule;
//# sourceMappingURL=SrcModule.js.map