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
     * @param req 请求头
     */
    SrcOperation.getFile = function (req) {
        return new Promise(function (r) {
            var _url = req.url;
            // console.log(_url);
            var _ifMap = false;
            //提取模块目录
            if (/\.map/.test(_url)) {
                _ifMap = true;
                _url = _url.replace(/\.map/, '');
            }
            //
            SrcCache_1.default.getModule(_url).task.then(function (module) {
                var _a, _b;
                //读取请求头中带有的协商缓存信息
                var _etag = (_b = (_a = req) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b['if-none-match'];
                //
                var _fileData = {
                    content: BufferT_1.default.nullBuffer,
                    stateCode: 404,
                    resHead: {},
                };
                //判断是不是.map文件.map文件是浏览器自己发起了，跟项目无关。
                if (_ifMap) {
                    _fileData.stateCode = 200;
                    _fileData.content = module.content.map;
                    // console.log(module);
                }
                else {
                    //判断etag
                    if (_etag == module.modifyKey) {
                        _fileData.stateCode = 304;
                        //
                        // console.log('协商缓存');
                    }
                    else {
                        _fileData.stateCode = 200;
                        _fileData.resHead = {
                            //协商缓存标识
                            'etag': module.modifyKey,
                            //添加文件唯一标识符
                            'file-only-key': module.key,
                        };
                        _fileData.content = module.content.code;
                    }
                }
                //
                r(_fileData);
            });
        });
    };
    return SrcOperation;
}());
exports.default = SrcOperation;
//# sourceMappingURL=SrcOperation.js.map