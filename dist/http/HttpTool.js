"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var internal_ip_1 = __importDefault(require("internal-ip"));
var MainConfig_1 = __importDefault(require("../config/MainConfig"));
var PortTool_1 = __importDefault(require("./PortTool"));
var chalk_1 = __importDefault(require("chalk"));
/**
 * http工具
 */
var HttpTool = /** @class */ (function () {
    function HttpTool() {
    }
    /**
     * 创建一个http服务
     * @param _f 请求响应执行方法
     * @param _port 端口
     */
    HttpTool.createServer = function (_f, _port) {
        var _portP;
        //端口为0则自动分配端口
        if (_port == 0) {
            _portP = PortTool_1.default.getPool('http服务');
        }
        else {
            _portP = Promise.resolve(_port);
        }
        //
        return _portP.then(function (port) {
            //开启一个本地服务
            var server = http_1.default.createServer(_f).listen(port);
            //
            return server;
        });
    };
    Object.defineProperty(HttpTool, "getHostname", {
        /**
         * 获取主机地址
         */
        get: function () {
            if (!this.m_hostName) {
                this.m_hostName = internal_ip_1.default.v4.sync();
                if (!this.m_hostName) {
                    this.m_hostName = MainConfig_1.default.config.hostName;
                    if (!this.m_hostName) {
                        console.log(chalk_1.default.red("\u81EA\u52A8\u83B7\u53D6\u4E3B\u673A\u5730\u5740\u5931\u8D25\uFF01\u8BF7\u5728\u914D\u7F6E\u6587\u4EF6\u4E2D\u914D\u7F6E\u6B63\u786E\u7684\u4E3B\u673A\u5730\u5740\u3002\u5F53\u524D\u5F97\u5230\u7684\u914D\u7F6E\u4E3A->" + this.m_hostName));
                    }
                }
            }
            //
            MainConfig_1.default.config.ifLog && console.log("\u5F53\u524D\u83B7\u53D6\u7684\u4E3B\u673A\u5730\u5740\u4E3A:" + this.m_hostName);
            //
            return this.m_hostName;
        },
        enumerable: false,
        configurable: true
    });
    return HttpTool;
}());
exports.default = HttpTool;
//# sourceMappingURL=HttpTool.js.map