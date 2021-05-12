"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileModule_1 = require("../../com/FileModule");
const MainConfig_1 = require("../../config/MainConfig");
const EWebSocketMesType_1 = require("../../webSocket/EWebSocketMesType");
const WebSocket_1 = require("../../webSocket/WebSocket");
const TsBuild_1 = require("./TsBuild");
var moment = require('moment');
var chalk = require('chalk');
/**
 * Src模块
 */
class SrcModule extends FileModule_1.default {
    /** 初始化回调 */
    _init() {
        //
        if (MainConfig_1.default.config.ifLog) {
            console.log(chalk.gray('-> 创建模块'));
            console.log(chalk.gray(this.absolutePath));
        }
    }
    /**
     * 更新回调
     */
    _update() {
        SrcModule.m_updateSum++;
        //
        if (MainConfig_1.default.config.ifLog) {
            console.log(chalk.gray('>'));
            console.log(chalk.gray('--> 模块更新'), chalk.yellow(this.absolutePath));
            console.log(chalk.gray('x', this.updateNumber), chalk.magenta('X', SrcModule.m_updateSum), chalk.blue(moment(Date.now()).format('HH:mm:ss')));
        }
        //发出脚本更新事件
        WebSocket_1.default.send(this.key, EWebSocketMesType_1.EWebSocketMesType.scriptUpdate);
    }
    /** 更新内容 */
    _updateContent() {
        //返回一个esbuild的任务
        return TsBuild_1.default.build(this.absolutePath, this.suffix);
    }
    /** 处理错误回调 */
    _mismanage(_e) {
        if (!_e) {
            return '';
        }
        //
        let _mess = [];
        let _vscodeUrl;
        if (typeof _e == 'object' && Array.isArray(_e)) {
            for (let _o of _e) {
                //拼接vscodeUrl
                _vscodeUrl = `vscode://file/${encodeURI(`${this.normPath}:${_o.location.line}`)}`;
                //
                _mess.push({
                    text: `文件：${this.normPath}\n位置：${_o.location.line}:${_o.location.column}\n错误代码：${_o.location.lineText}\n错误信息：${_o.text}`,
                    vsCodeUrl: _vscodeUrl,
                });
            }
        }
        else {
            _mess.push({
                text: _e,
                vsCodeUrl: `vscode://file/${this.normPath}`,
            });
        }
        //最后的代码
        let _content = '';
        for (let _mes of _mess) {
            console.log(chalk.yellow('esbuild打包错误'));
            console.log(chalk.gray(_mes.text));
            //
            _content += `
                console.error('Esbuild打包出错');
                console.error(\`${_mes.text}\`);
                ${_mes.vsCodeUrl ? `console.error('点击直达：', \`${_mes.vsCodeUrl}\`);` : ''}
                \n
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