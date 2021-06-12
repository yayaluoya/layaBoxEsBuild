"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
/**
 * 版本控制工具
 */
var VersionsT = /** @class */ (function () {
    function VersionsT() {
    }
    /**
     * 获取版本
     */
    VersionsT.getV = function () {
        if (!this.v) {
            this.v = crypto_1.default.createHash('md5').update(Date.now() + ":_versions:" + Math.random()).digest('hex');
            ;
        }
        //
        return this.v;
    };
    return VersionsT;
}());
exports.default = VersionsT;
//# sourceMappingURL=VersionsT.js.map