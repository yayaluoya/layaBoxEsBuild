"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PackageJson_1 = __importDefault(require("../config/PackageJson"));
/**
 * sw工具
 */
var SwT = /** @class */ (function () {
    function SwT() {
    }
    Object.defineProperty(SwT, "swURL", {
        /** swURL */
        get: function () {
            if (!this.m_swURL) {
                this.m_swURL = "esbuildSw@" + PackageJson_1.default['version'];
            }
            return this.m_swURL;
        },
        enumerable: false,
        configurable: true
    });
    return SwT;
}());
exports.default = SwT;
//# sourceMappingURL=SwT.js.map