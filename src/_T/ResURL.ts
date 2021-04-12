import URLT from "./URLT";
const crypto = require('crypto');

/**
 * 资源路径类
 */
export default class ResURL {
    /** 服务路径 */
    public static get serveURL(): string {
        return 'http://localhost:3060/';
    }

    /** 后端根路径 */
    public static get rootURL(): string {
        return URLT.resolve(__dirname, '../../');
    }

    /** public路径 */
    public static get publicURL(): string {
        return URLT.join(this.rootURL, '/public/');
    }

    /** 公共目录名称，一个随机值，不固定 */
    private static m_publicDirName: string;

    /** 公共目录名称 */
    public static get publicDirName(): string {
        if (!this.m_publicDirName) {
            this.m_publicDirName = crypto.createHash('md5').update(Date.now() + '_').digest('hex');
        }
        return this.m_publicDirName;
    }
}