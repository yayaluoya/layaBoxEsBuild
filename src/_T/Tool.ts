/**
 * 工具
 */
export default class Tool {
    /**
     * 获取一个随机字符串
     */
    public static getRandomStr(): string {
        return Math.random().toString().replace(/\./, '');
    }
}