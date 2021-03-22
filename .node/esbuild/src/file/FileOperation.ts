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
                //读取请求头中带有的协商缓存信息
                let _etag: string = req.headers['if-none-match'];
                // console.log(req.headers);
                //
                let _fileData: IFileData = {
                    content: '',
                    stateCode: 404,
                    resHead: {},
                };
                //判断etag
                if (_etag == module.modifyKey) {
                    _fileData.stateCode = 304;
                    //
                    // console.log('协商缓存');
                } else {
                    _fileData.stateCode = 200;
                    _fileData.resHead = {
                        //协商缓存标识
                        'etag': module.modifyKey,
                    };
                    _fileData.content = module.code;
                }
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