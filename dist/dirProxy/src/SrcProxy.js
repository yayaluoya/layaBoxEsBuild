"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MainConfig_1 = __importDefault(require("../../config/MainConfig"));
const HttpTool_1 = __importDefault(require("../../http/HttpTool"));
const SrcOperation_1 = __importDefault(require("./SrcOperation"));
const ResHead_1 = require("../../com/ResHead");
const NodeModulesT_1 = require("./NodeModulesT");
/**
 * src代理
 */
class SrcProxy {
    /**
     * 开始
     */
    static start() {
        return __awaiter(this, void 0, void 0, function* () {
            //开启node_module服务
            yield NodeModulesT_1.server();
            // 开启代码请求服务
            return HttpTool_1.default.createServer((req, res) => {
                //get请求
                switch (req.method) {
                    case 'GET':
                        //
                        SrcOperation_1.default.getFile(req).then((_fileData) => {
                            //
                            res.writeHead(_fileData.stateCode, Object.assign(Object.assign({}, ResHead_1.cacheOneDayHead), _fileData.resHead));
                            //返回数据
                            res.end(_fileData.content);
                        });
                        break;
                }
            }, MainConfig_1.default.config.port.src).then((server) => {
                //重置scr目录服务代理端口
                MainConfig_1.default.config.port.src = server.address().port;
            });
        });
    }
    /**
     * 获取主页地址
     */
    static getHomePage() {
        return '';
    }
}
exports.default = SrcProxy;
//# sourceMappingURL=SrcProxy.js.map