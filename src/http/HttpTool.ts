const http = require('http');
const internalIp = require('internal-ip');

/**
 * http工具
 */
export default class HttpTool {
    /**
     * 创建一个http服务
     * @param _f 请求响应执行方法
     * @param _port 端口
     */
    public static createServer(_f: (req, res) => void, _port: number) {
        //开启一个本地服务
        http.createServer(_f).listen(_port);
        //开启一个局域网服务
        http.createServer(_f).listen(_port, this.getHostname);
    }

    /** 主机名字 */
    private static m_hostName: string;
    /**
     * 获取主机地址
     */
    public static get getHostname(): string {
        if (!this.m_hostName) {
            this.m_hostName = internalIp.v4.sync();
        }
        return this.m_hostName;
    }
}