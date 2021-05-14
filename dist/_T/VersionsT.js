"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require('crypto');
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
            this.v = crypto.createHash('md5').update(Date.now() + '_versions').digest('hex');
            ;
        }
        //
        return this.v;
    };
    return VersionsT;
}());
exports.default = VersionsT;
//# sourceMappingURL=VersionsT.js.map