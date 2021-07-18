import needle from "needle";
import PackageConfig from "../config/PackageConfig";

/**
 * gitee工具
 */
export default class GiteeTool {
    /**
     * 获取文件
     * @param _url 文件路径
     */
    public static getFile(_url: string): Promise<string> {
        return new Promise<string>((r, e) => {
            needle('get', `https://gitee.com/api/v5/repos/${PackageConfig.package.authorName}/${PackageConfig.package.name}/git/trees/master?recursive=1`)
                .then((resp) => {
                    let _fileTree: any[] = resp.body.tree || [];
                    let _fileUrl: string = _fileTree.find((item) => {
                        return item.path == _url.replace(/^\/+/, '');
                    })?.url;
                    if (_fileUrl) {
                        needle('get', _fileUrl)
                            .then((resp) => {
                                r(Buffer.from(resp.body.content, resp.body.encoding).toString());
                            }, e);
                    } else {
                        e('没有找到这个文件！');
                    }
                }, e);
        });
    }
}