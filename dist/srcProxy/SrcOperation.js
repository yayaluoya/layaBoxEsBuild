"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SrcCache_1 = require("./SrcCache");
/**
 * 文件操作
 */
class SrcOperation {
    /**
     * 获取文件
     * @param req 请求头
     */
    static getFile(req) {
        return new Promise((r) => {
            SrcCache_1.default.getModule(req.url).task.then((module) => {
                //读取请求头中带有的协商缓存信息
                let _etag = req.headers['if-none-match'];
                // console.log(req.headers);
                //
                let _fileData = {
                    content: '',
                    stateCode: 404,
                    resHead: {},
                };
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
                    };
                    _fileData.content = module.content;
                }
                //
                r(_fileData);
            });
        });
    }
}
exports.default = SrcOperation;
//# sourceMappingURL=SrcOperation.js.map