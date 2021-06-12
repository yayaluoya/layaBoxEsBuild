"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 模板工具
 */
var TemplateT = /** @class */ (function () {
    function TemplateT() {
    }
    /**
     * 替换模板变量
     * @param _content 源字符串
     * @param _o 目标变量
     */
    TemplateT.ReplaceVariable = function (_content, _o) {
        return _content.replace(/\$\$([a-zA-Z]+)/g, function (_, b) {
            return (typeof _o[b] == 'object') ? JSON.stringify(_o[b]) : _o[b];
        });
    };
    return TemplateT;
}());
exports.default = TemplateT;
//# sourceMappingURL=TemplateT.js.map