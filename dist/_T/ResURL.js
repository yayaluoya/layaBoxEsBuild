"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
/**
 * 资源路径类
 */
var ResURL = /** @class */ (function () {
    function ResURL() {
    }
    Object.defineProperty(ResURL, "rootURL", {
        /** 工具根路径 */
        get: function () {
            return path_1.resolve(__dirname, '../../');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResURL, "publicURL", {
        /** public路径 */
        get: function () {
            return path_1.join(this.rootURL, '/public/');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResURL, "cwdUrl", {
        /** 执行目录 */
        get: function () {
            return process.cwd();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResURL, "publicSrcURL", {
        /** 获取public路径下代码的路径 */
        get: function () {
            return path_1.join(this.publicDirName, "/dist/");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResURL, "publicResURL", {
        /** 获取public路径下资源的路径 */
        get: function () {
            return path_1.join(this.publicDirName, '/res/');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResURL, "publicDirName", {
        /** 公共目录名称 */
        get: function () {
            if (!this.m_publicDirName) {
                this.m_publicDirName = '_⚙️_leb';
            }
            return this.m_publicDirName;
        },
        enumerable: false,
        configurable: true
    });
    return ResURL;
}());
exports.default = ResURL;
//# sourceMappingURL=ResURL.js.map