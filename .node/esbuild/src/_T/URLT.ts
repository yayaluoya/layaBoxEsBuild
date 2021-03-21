import { join, resolve, sep } from "path";

/**
 * 路径工具
 */
export default class URLT {
    /**
     * 将所有参数连接在一起，并规范化结果路径。
     * 参数必须是字符串。
     * 在v0.8中，非字符串参数被无声地忽略。
     * 在v0.10及以上版本中，会抛出异常。
     * @param paths url列表
     */
    public static join(...paths: string[]): string {
        let _url: string = join(...paths);
        return _url;
    }

    /**
     * 通过一个路径获取另一个路径
     * @param pathSegments 
     */
    public static resolve(...pathSegments: string[]): string {
        return resolve(...pathSegments);
    }

    /** 文件分隔符。“\”或“/” */
    public static get sep(): string {
        return sep;
    }
}