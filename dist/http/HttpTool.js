"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var portfinder_1 = __importDefault(require("portfinder"));
var internal_ip_1 = __importDefault(require("internal-ip"));
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
        var _this = this;
        var _portP;
        //端口为0则自动分配端口
        if (_port == 0) {
            _portP = portfinder_1.default.getPortPromise();
        }
        else {
            _portP = Promise.resolve(_port);
        }
        //
        return _portP.then(function (port) {
            //开启一个本地服务
            var server = http_1.default.createServer(_f).listen(port);
            //开启一个局域网服务
            http_1.default.createServer(_f).listen(port, _this.getHostname);
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
            }
            return this.m_hostName;
        },
        enumerable: false,
        configurable: true
    });
    return HttpTool;
}());
exports.default = HttpTool;
//# sourceMappingURL=HttpTool.js.map