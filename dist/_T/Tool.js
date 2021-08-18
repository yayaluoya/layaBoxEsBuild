"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 工具
 */
var Tool = /** @class */ (function () {
    function Tool() {
    }
    /**
     * 获取一个随机字符串
     */
    Tool.getRandomStr = function () {
        return Math.random().toString().replace(/\./, '');
    };
    return Tool;
}());
exports.default = Tool;
//# sourceMappingURL=Tool.js.map