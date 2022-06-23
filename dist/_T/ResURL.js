"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
/**
 * 资源路径类
 */
class ResURL {
    /** 工具根路径 */
    static get rootURL() {
        return path_1.resolve(__dirname, '../../');
    }
    /** public路径 */
    static get publicURL() {
        return path_1.join(this.rootURL, '/public/');
    }
    /** 执行目录 */
    static get cwdUrl() {
        return process.cwd();
    }
    /** 获取public路径下代码的路径 */
    static get publicSrcURL() {
        return path_1.join(this.publicDirName, `/dist/`);
    }
    /** 获取public路径下资源的路径 */
    static get publicResURL() {
        return path_1.join(this.publicDirName, '/res/');
    }
    /** 公共目录名称 */
    static get publicDirName() {
        if (!this.m_publicDirName) {
            this.m_publicDirName = '_⚙️_leb';
        }
        return this.m_publicDirName;
    }
}
exports.default = ResURL;
//# sourceMappingURL=ResURL.js.map