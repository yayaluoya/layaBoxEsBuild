"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainConfig_1 = require("../../config/MainConfig");
/**
 * Src文件过渡操作
 * 当从本地读取文件的是否会经过这个流程
 */
class SrcTransition {
    /**
     * ts文件打包后
     * @param _content 文件内容
     */
    static tsBuildBack(_content) {
        //处理路径
        _content = _content.replace(/import.*?["'](.*?)["'];/g, (text, $1) => {
            let _$1 = $1;
            if (MainConfig_1.default.config.filePathModify && MainConfig_1.default.config.filePathModify.length > 0) {
                for (let _o of MainConfig_1.default.config.filePathModify) {
                    _$1 = _$1.replace(_o.a, _o.b);
                }
            }
            //
            return text.replace($1, _$1);
        });
        //
        return _content;
    }
    /**
     * 普通文件打包后
     * @param _content 文件内容
     */
    static textBuildBack(_content) {
        //
        return `
export default \`${_content}\`;
        `;
    }
}
exports.default = SrcTransition;
//# sourceMappingURL=SrcTransition.js.map