"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FileModule_1 = __importDefault(require("../../com/FileModule"));
const MainConfig_1 = __importDefault(require("../../config/MainConfig"));
const EWebSocketMesType_1 = require("../../webSocket/EWebSocketMesType");
const WebSocket_1 = __importDefault(require("../../webSocket/WebSocket"));
const moment_1 = __importDefault(require("moment"));
const chalk_1 = __importDefault(require("chalk"));
const FileBuild_1 = require("./FileBuild");
/**
 * Src模块
 */
class SrcModule extends FileModule_1.default {
    /**
     * update方法
     */
    get updateH() {
        if (!this._updateH) {
            this._updateH = (_url) => {
                //发送webSocket消息
                WebSocket_1.default.send(`src代码@${_url || this.url}✔️`, EWebSocketMesType_1.EWebSocketMesType.contentUpdate);
                //
                this.update();
            };
        }
        return this._updateH;
    }
    /** 初始化回调 */
    _init() {
        //
        if (MainConfig_1.default.config.ifLog) {
            console.log(chalk_1.default.gray('-> 创建模块'));
            console.log(chalk_1.default.gray(this.absolutePath));
        }
    }
    /**
     * 更新回调
     */
    _update() {
        SrcModule.m_updateSum++;
        //
        if (MainConfig_1.default.config.ifLog) {
            console.log(chalk_1.default.gray('>'));
            console.log(chalk_1.default.gray('--> 模块更新'), chalk_1.default.yellow(this.absolutePath));
            console.log(chalk_1.default.gray('x', this.updateNumber), chalk_1.default.magenta('X', SrcModule.m_updateSum), chalk_1.default.blue(moment_1.default(Date.now()).format('HH:mm:ss')));
        }
        //发出脚本更新事件
        WebSocket_1.default.send(this.key, EWebSocketMesType_1.EWebSocketMesType.scriptUpdate);
    }
    /** 更新内容 */
    _updateContent() {
        //返回一个esbuild的任务
        return FileBuild_1.FileBuild(this.absolutePath, this.url, this.updateH);
    }
    /** 处理错误回调 */
    _mismanage(_e) {
        if (!_e) {
            return '';
        }
        //
        let _mess = [];
        //
        if (typeof _e == 'object' && Array.isArray(_e)) {
            for (let _o of _e) {
                //拼接vscodeUrl
                //
                _mess.push({
                    text: `文件：${this.normPath}\n位置：${_o.location.line}:${_o.location.column}\n错误代码：${_o.location.lineText}\n错误信息：${_o.text}`,
                    vsCodeUrl: `vscode://file/${escape(`${this.normPath}:${_o.location.line}:${_o.location.column}`)}`,
                });
            }
        }
        else {
            _mess.push({
                text: _e,
                vsCodeUrl: `vscode://file/${escape(this.normPath)}`,
            });
        }
        //最后的代码
        let _content = '';
        moment_1.default.locale('zh-cn');
        let _time = moment_1.default().format('LLL');
        for (let _mes of _mess) {
            console.log(chalk_1.default.yellow('esbuild编译错误！'));
            console.log(chalk_1.default.gray(_mes.text));
            console.log(chalk_1.default.gray(_time));
            //这里引入全局定义的函数
            _content += `
                console.error(...esbuildTool.consoleEx.pack(esbuildTool.consoleEx.getStyle('#eeeeee', 'red'),\`esbuild编译错误！\n-\n${_mes.text}${_mes.vsCodeUrl ? `\n-\n在vscode中打开：${_mes.vsCodeUrl}` : ''}\n-\n${_time}\`));
            `;
        }
        //
        return _content;
    }
}
exports.default = SrcModule;
/** 更新总数 */
SrcModule.m_updateSum = 0;
//# sourceMappingURL=SrcModule.js.map