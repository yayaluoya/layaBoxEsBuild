"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const URLT_1 = require("./URLT");
const crypto = require('crypto');
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
    /** 获取public目录下代码目录名字 */
    static get publicSrcDirName() {
        return 'dist';
    }
    /** 获取public路径下代码的路径 */
    static get publicSrcURL() {
        return URLT_1.default.join(this.publicDirName, `/${this.publicSrcDirName}/`);
    }
    /** 获取public路径下资源的路径 */
    static get publicResURL() {
        return URLT_1.default.join(this.publicDirName, '/res/');
    }
    /** 公共目录名称 */
    static get publicDirName() {
        if (!this.m_publicDirName) {
            this.m_publicDirName = crypto.createHash('md5').update(Date.now() + '_').digest('hex');
        }
        return this.m_publicDirName;
    }
}
exports.default = ResURL;
//# sourceMappingURL=ResURL.js.map