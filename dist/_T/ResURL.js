"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const URLT_1 = require("./URLT");
/**
 * 资源路径类
 */
class ResURL {
    /** 服务路径 */
    static get serveURL() {
        return 'http://localhost:3060/';
    }
    /** 后端根路径 */
    static get rootURL() {
        return URLT_1.default.resolve(__dirname, '../../');
    }
    /** public路径 */
    static get publicURL() {
        return URLT_1.default.join(this.rootURL, '/public/');
    }
}
exports.default = ResURL;
//# sourceMappingURL=ResURL.js.map