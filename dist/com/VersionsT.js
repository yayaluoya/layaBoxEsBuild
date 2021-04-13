"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require('crypto');
/**
 * 版本控制工具
 */
class VersionsT {
    /**
     * 获取版本
     */
    static getV() {
        if (!this.v) {
            this.v = crypto.createHash('md5').update(Date.now() + '_versions').digest('hex');
            ;
        }
        //
        return this.v;
    }
}
exports.default = VersionsT;
//# sourceMappingURL=VersionsT.js.map