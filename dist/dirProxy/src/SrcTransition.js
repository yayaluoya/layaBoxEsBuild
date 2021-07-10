"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefLoaders = void 0;
var MainConfig_1 = __importDefault(require("../../config/MainConfig"));
/** 默认loader列表 */
exports.DefLoaders = {
    /** 路径处理loader */
    'path': function (_content, _suffix) {
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
        return Promise.resolve(_content);
    },
    /** text处理插件 */
    'text': function (_content, _suffix) {
        //需要转义反引号 `
        return Promise.resolve("\n    export default `" + _content.replace(/`/, '\\`') + "`;\n            ");
    }
};
//# sourceMappingURL=SrcTransition.js.map