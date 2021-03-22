import FileCache from "./FileCache";

/**
 * 文件操作
 */
export default class FileOperation {
    /**
     * 获取文件
     * @param req 请求头
     */
    public static getFile(req): Promise<IFileData> {
        return new Promise<IFileData>((r, e) => {
            FileCache.getModule(req.url).promise.then((module) => {
                //
                let _fileData: IFileData = {
                    content: module.code,
                    stateCode: 200,
                    resHead: {},
                };
                //
                r(_fileData);
            });
        });
    }
}

/**
 * 文件数据
 */
export interface IFileData {
    /** 文件内容 */
    content: string,
    /** 状态码 */
    stateCode: number,
    /** 响应头 */
    resHead: any,
}