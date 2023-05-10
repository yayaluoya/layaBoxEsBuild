import crypto from 'crypto';

/**
 * 版本控制工具
 */
export default class VersionsT {
    /** 版本 */
    private static v: string;

    /**
     * 获取版本
     */
    public static getV(): string {
        if (!this.v) {
            this.v = crypto
                .createHash('md5')
                .update(`${Date.now()}:_versions:${Math.random()}`)
                .digest('hex');
        }
        //
        return this.v;
    }
}
