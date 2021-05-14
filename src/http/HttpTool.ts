import http from "http";
import portfinder from "portfinder";
import internalIp from "internal-ip";

/**
 * http工具
 */
export default class HttpTool {
    /**
     * 创建一个http服务
     * @param _f 请求响应执行方法
     * @param _port 端口
     */
    public static createServer(_f: http.RequestListener, _port: number): Promise<http.Server> {
        let _portP: Promise<number>;
        //端口为0则自动分配端口
        if (_port == 0) {
            _portP = portfinder.getPortPromise();
        } else {
            _portP = Promise.resolve(_port);
        }
        //
        return _portP.then((port) => {
            //开启一个本地服务
            let server = http.createServer(_f).listen(port);
            //开启一个局域网服务
            http.createServer(_f).listen(port, this.getHostname);
            //
            return server;
        });
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