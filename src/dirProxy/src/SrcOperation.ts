import IFileData from "../../com/IFileData";
import BufferT from "../../_T/BufferT";
import SrcCache from "./SrcCache";
import SrcModule from "./SrcModule";

/**
 * 文件操作
 */
export default class SrcOperation {
    /**
     * 获取文件
     * @param req 请求
     */
    public static getFile(req): Promise<IFileData> {
        return new Promise<IFileData>((r) => {
            let _url: string = req.url;
            // console.log(_url);
            let _ifMap: boolean = false;
            //提取模块目录
            if (/\.map/.test(_url)) {
                _ifMap = true;
                _url = _url.replace(/\.map/, '');
            }
            //
            SrcCache.getModule(_url).task.then((module: SrcModule) => {
                //
                let _fileData: IFileData = {
                    content: BufferT.nullBuffer,
                    stateCode: 200,
                    resHead: {},
                };
                //判断是不是.map文件.map文件是浏览器自己发起的，跟项目无关。
                if (_ifMap) {
                    _fileData.content = module.content.map;
                    // console.log(module);
                } else {
                    _fileData.content = module.content.code;
                }
                //
                r(_fileData);
            });
        });
    }
}