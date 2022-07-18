"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const internal_ip_1 = __importDefault(require("internal-ip"));
const MainConfig_1 = __importDefault(require("../config/MainConfig"));
const PortTool_1 = __importDefault(require("./PortTool"));
const chalk_1 = __importDefault(require("chalk"));
const spdy_1 = __importDefault(require("spdy"));
const fs_1 = require("fs");
const path_1 = require("path");
const ResURL_1 = __importDefault(require("../_T/ResURL"));
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
        let _portP;
        //端口为0则自动分配端口
        if (_port == 0) {
            _portP = PortTool_1.default.getPool('http服务');
        }
        else {
            _portP = Promise.resolve(_port);
        }
        //
        return _portP.then((port) => {
            //开启一个本地服务
            let server = spdy_1.default.createServer({
                key: fs_1.readFileSync(path_1.join(ResURL_1.default.pem, '/privkey.pem')),
                cert: fs_1.readFileSync(path_1.join(ResURL_1.default.pem, '/cacert.pem')),
            }, _f).listen(port);
            //
            return server;
        });
    }
    /**
     * 获取主机地址
     */
    static get getHostname() {
        if (!this.m_hostName) {
            this.m_hostName = internal_ip_1.default.v4.sync();
            if (!this.m_hostName) {
                this.m_hostName = MainConfig_1.default.config.hostName;
                if (!this.m_hostName) {
                    console.log(chalk_1.default.red(`自动获取主机地址失败！请在配置文件中配置正确的主机地址。当前得到的配置为->${this.m_hostName}`));
                }
            }
            MainConfig_1.default.config.ifLog && console.log(`当前获取的主机地址为:${this.m_hostName}`);
        }
        //
        //
        return this.m_hostName;
    }
}
exports.default = HttpTool;
//# sourceMappingURL=HttpTool.js.map