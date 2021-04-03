"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileModule_1 = require("../com/FileModule");
const main_1 = require("../main");
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
        if (main_1.default.config.ifLog) {
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
        if (main_1.default.config.ifLog) {
            console.log(chalk.gray('>'));
            console.log(chalk.gray('--> 模块更新'), chalk.yellow(this.absolutePath));
            console.log(chalk.gray('x', this.updateNumber), chalk.magenta('X', SrcModule.m_updateSum), chalk.blue(moment(Date.now()).format('HH:mm:ss')));
        }
    }
    /** 更新内容 */
    _updateContent() {
        //打包ts文件
        return TsBuild_1.default.build(this.url, this.suffix);
    }
}
exports.default = SrcModule;
/** 更新总数 */
SrcModule.m_updateSum = 0;
//# sourceMappingURL=SrcModule.js.map