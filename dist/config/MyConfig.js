"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tool_1 = __importDefault(require("../_T/Tool"));
/**
 * MyConfig
 */
class MyConfig {
}
exports.default = MyConfig;
/** web工具脚本 */
MyConfig.webToolJsName = {
    main: 'main.js',
    webSocket: 'webSocketTool.js',
    css: 'webTool.css',
    load: 'loadTool.js',
    alert: 'alertTool.js',
};
/** web工具脚本唯一key */
MyConfig.webToolJsOnlyKey = {
    main: `${Date.now()}_1_${Tool_1.default.getRandomStr()}`,
    webSocket: `${Date.now()}_2_${Tool_1.default.getRandomStr()}`,
    css: `${Date.now()}_3_${Tool_1.default.getRandomStr()}`,
    load: `${Date.now()}_4_${Tool_1.default.getRandomStr()}`,
    alert: `${Date.now()}_5_${Tool_1.default.getRandomStr()}`,
};
//# sourceMappingURL=MyConfig.js.map