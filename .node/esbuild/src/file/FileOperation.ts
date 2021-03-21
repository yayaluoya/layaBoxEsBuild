import FileCache from "./FileCache";

/**
 * 文件操作
 */
export default class FileOperation {
    /**
     * 获取文件
     * @param _url 绝对路径
     */
    public static getFile(_url: string): Promise<string> {
        return new Promise<string>((r, e) => {
            FileCache.getModule(_url).promise.then((module) => {
                r(module.code);
            });
        });
    }
}