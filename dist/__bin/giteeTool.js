"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var needle_1 = __importDefault(require("needle"));
var PackageConfig_1 = __importDefault(require("../config/PackageConfig"));
/**
 * gitee工具
 */
var GiteeTool = /** @class */ (function () {
    function GiteeTool() {
    }
    /**
     * 获取文件
     * @param _url 文件路径
     */
    GiteeTool.getFile = function (_url) {
        return new Promise(function (r, e) {
            needle_1.default('get', "https://gitee.com/api/v5/repos/" + PackageConfig_1.default.package.authorName + "/" + PackageConfig_1.default.package.name + "/git/trees/master?recursive=1")
                .then(function (resp) {
                var _a;
                var _fileTree = resp.body.tree || [];
                var _fileUrl = (_a = _fileTree.find(function (item) {
                    return item.path == _url.replace(/^\/+/, '');
                })) === null || _a === void 0 ? void 0 : _a.url;
                if (_fileUrl) {
                    needle_1.default('get', _fileUrl)
                        .then(function (resp) {
                        r(Buffer.from(resp.body.content, resp.body.encoding).toString());
                    }, e);
                }
                else {
                    e('没有找到这个文件！');
                }
            }, e);
        });
    };
    return GiteeTool;
}());
exports.default = GiteeTool;
//# sourceMappingURL=giteeTool.js.map