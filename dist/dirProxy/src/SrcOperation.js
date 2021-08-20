"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BufferT_1 = __importDefault(require("../../_T/BufferT"));
var SrcCache_1 = __importDefault(require("./SrcCache"));
/**
 * 文件操作
 */
var SrcOperation = /** @class */ (function () {
    function SrcOperation() {
    }
    /**
     * 获取文件
     * @param req 请求
     */
    SrcOperation.getFile = function (req) {
        var _this = this;
        return new Promise(function (r) {
            var _url = req.url;
            // console.log(_url);
            var _ifMap = false;
            //提取模块目录
            if (_this.mapReg.test(_url)) {
                _ifMap = true;
                _url = _url.replace(_this.mapReg, '');
            }
            //
            SrcCache_1.default.getModule(_url).task.then(function (module) {
                //
                var _fileData = {
                    content: BufferT_1.default.nullBuffer,
                    stateCode: 200,
                    resHead: {},
                };
                //判断是不是.map文件.map文件是浏览器自己发起的，跟项目无关。
                if (_ifMap) {
                    _fileData.content = module.content.map;
                    // console.log(module);
                }
                else {
                    _fileData.content = module.content.code;
                }
                //
                r(_fileData);
            });
        });
    };
    /** 匹配map的正则 */
    SrcOperation.mapReg = /\.map$/;
    return SrcOperation;
}());
exports.default = SrcOperation;
//# sourceMappingURL=SrcOperation.js.map