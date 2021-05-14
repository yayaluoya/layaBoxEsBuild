"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var URLT_1 = __importDefault(require("./URLT"));
var crypto = require('crypto');
/**
 * 资源路径类
 */
var ResURL = /** @class */ (function () {
    function ResURL() {
    }
    Object.defineProperty(ResURL, "serveURL", {
        /** 服务路径 */
        get: function () {
            return 'http://localhost:3060/';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResURL, "rootURL", {
        /** 后端根路径 */
        get: function () {
            return URLT_1.default.resolve(__dirname, '../../');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResURL, "publicURL", {
        /** public路径 */
        get: function () {
            return URLT_1.default.join(this.rootURL, '/public/');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResURL, "publicSrcDirName", {
        /** 获取public目录下代码目录名字 */
        get: function () {
            return 'dist';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResURL, "publicSrcURL", {
        /** 获取public路径下代码的路径 */
        get: function () {
            return URLT_1.default.join(this.publicDirName, "/" + this.publicSrcDirName + "/");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResURL, "publicResURL", {
        /** 获取public路径下资源的路径 */
        get: function () {
            return URLT_1.default.join(this.publicDirName, '/res/');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResURL, "publicDirName", {
        /** 公共目录名称 */
        get: function () {
            if (!this.m_publicDirName) {
                this.m_publicDirName = crypto.createHash('md5').update(Date.now() + '_').digest('hex');
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