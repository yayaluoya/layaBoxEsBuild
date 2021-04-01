import URLT from "./URLT";

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
}