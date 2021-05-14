"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MainConfig_1 = __importDefault(require("../../config/MainConfig"));
/**
 * Src文件过渡操作
 * 当从本地读取文件的是否会经过这个流程
 */
var SrcTransition = /** @class */ (function () {
    function SrcTransition() {
    }
    /**
     * ts文件打包后
     * @param _content 文件内容
     */
    SrcTransition.tsBuildBack = function (_content) {
        //处理路径
        _content = _content.replace(/import.*?["'](.*?)["'];/g, function (text, $1) {
            var _$1 = $1;
            if (MainConfig_1.default.config.filePathModify && MainConfig_1.default.config.filePathModify.length > 0) {
                for (var _i = 0, _a = MainConfig_1.default.config.filePathModify; _i < _a.length; _i++) {
                    var _o = _a[_i];
                    _$1 = _$1.replace(_o.a, _o.b);
                }
            }
            //
            return text.replace($1, _$1);
        });
        //
        return _content;
    };
    /**
     * 普通文件打包后
     * @param _content 文件内容
     */
    SrcTransition.textBuildBack = function (_content) {
        //需要转义反引号 `
        return "\nexport default `" + _content.replace(/`/, '\\`') + "`;\n        ";
    };
    return SrcTransition;
}());
exports.default = SrcTransition;
//# sourceMappingURL=SrcTransition.js.map