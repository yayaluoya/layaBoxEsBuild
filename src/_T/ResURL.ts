import { join, resolve } from "path";

/**
 * 资源路径类
 */
export default class ResURL {
    /** 工具根路径 */
    public static get rootURL(): string {
        return resolve(__dirname, '../../');
    }

    /** public路径 */
    public static get publicURL(): string {
        return join(this.rootURL, '/public/');
    }

    /** 获取public目录下代码目录名字 */
    public static readonly publicSrcDirName: string = 'dist';
    /** 获取public路径下代码的路径 */
    public static get publicSrcURL(): string {
        return join(this.publicDirName, `/${this.publicSrcDirName}/`);
    }
    /** 获取public路径下资源的路径 */
    public static get publicResURL(): string {
        return join(this.publicDirName, '/res/');
    }
    /** 公共目录名称，一个随机值，不固定 */
    private static m_publicDirName: string;
    /** 公共目录名称 */
    public static get publicDirName(): string {
        if (!this.m_publicDirName) {
            this.m_publicDirName = '_leb⚙️';
        }
        return this.m_publicDirName;
    }
}