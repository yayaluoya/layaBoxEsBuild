"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const portfinder_1 = __importDefault(require("portfinder"));
const MainConfig_1 = __importDefault(require("../config/MainConfig"));
/**
 * 端口工具
 */
class PortTool {
    /**
     * 获取一个未使用的端口
     * @param name 使用端口的描述
     */
    static getPool(describe) {
        MainConfig_1.default.config.ifLog && console.log(`${describe}-申请端口`);
        this.onGetPortTask = this.onGetPortTask.then(() => {
            return portfinder_1.default.getPortPromise().then((prot) => {
                MainConfig_1.default.config.ifLog && console.log(`${describe}得到端口`, prot);
                return prot;
            });
        });
        return this.onGetPortTask;
    }
}
exports.default = PortTool;
/** 当前获取端口的任务 */
PortTool.onGetPortTask = Promise.resolve();
//# sourceMappingURL=PortTool.js.map