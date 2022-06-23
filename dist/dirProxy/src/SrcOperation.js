"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BufferT_1 = __importDefault(require("../../_T/BufferT"));
const SrcCache_1 = __importDefault(require("./SrcCache"));
/**
 * 文件操作
 */
class SrcOperation {
    /**
     * 获取文件
     * @param req 请求
     */
    static getFile(req) {
        return new Promise((r) => {
            let _url = req.url;
            // console.log(_url);
            let _ifMap = false;
            //提取模块目录
            if (this.mapReg.test(_url)) {
                _ifMap = true;
                _url = _url.replace(this.mapReg, '');
            }
            //
            SrcCache_1.default.getModule(_url).task.then((module) => {
                //
                let _fileData = {
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
    }
}
exports.default = SrcOperation;
/** 匹配map的正则 */
SrcOperation.mapReg = /\.map$/;
//# sourceMappingURL=SrcOperation.js.map