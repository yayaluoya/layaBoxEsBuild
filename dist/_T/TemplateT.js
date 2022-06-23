"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 模板工具
 */
class TemplateT {
    /**
     * 替换模板变量
     * @param _content 源字符串
     * @param _o 目标变量
     */
    static ReplaceVariable(_content, _o) {
        return _content.replace(/\$\$([a-zA-Z]+)/g, (_, b) => {
            return (typeof _o[b] == 'object') ? JSON.stringify(_o[b]) : _o[b];
        });
    }
}
exports.default = TemplateT;
//# sourceMappingURL=TemplateT.js.map