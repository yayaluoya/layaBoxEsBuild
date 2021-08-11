"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var portfinder_1 = __importDefault(require("portfinder"));
var MainConfig_1 = __importDefault(require("../config/MainConfig"));
/**
 * 端口工具
 */
var PortTool = /** @class */ (function () {
    function PortTool() {
    }
    /**
     * 获取端口
     * @param name 使用端口的描述
     */
    PortTool.getPool = function (describe) {
        MainConfig_1.default.config.ifLog && console.log(describe + "-\u7533\u8BF7\u7AEF\u53E3");
        this.onGetPortTask = this.onGetPortTask.then(function () {
            return portfinder_1.default.getPortPromise().then(function (prot) {
                MainConfig_1.default.config.ifLog && console.log(describe + "\u5F97\u5230\u7AEF\u53E3", prot);
                return prot;
            });
        });
        return this.onGetPortTask;
    };
    /** 当前获取端口的任务 */
    PortTool.onGetPortTask = Promise.resolve();
    return PortTool;
}());
exports.default = PortTool;
//# sourceMappingURL=PortTool.js.map