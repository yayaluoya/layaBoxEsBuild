"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require('http');
const internalIp = require('internal-ip');
/**
 * http工具
 */
class HttpTool {
    /**
     * 创建一个http服务
     * @param _f 请求响应执行方法
     * @param _port 端口
     */
    static createServer(_f, _port) {
        //开启一个本地服务
        http.createServer(_f).listen(_port);
        //开启一个局域网服务
        http.createServer(_f).listen(_port, this.getHostname);
    }
    /**
     * 获取主机地址
     */
    static get getHostname() {
        if (!this.m_hostName) {
            this.m_hostName = internalIp.v4.sync();
        }
        return this.m_hostName;
    }
}
exports.default = HttpTool;
//# sourceMappingURL=HttpTool.js.map