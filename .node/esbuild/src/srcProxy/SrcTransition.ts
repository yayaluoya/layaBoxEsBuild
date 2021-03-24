import Config from "src/config/Config";

/**
 * Src文件过渡操作
 * 当从本地读取文件的是否会经过这个流程
 */
export default class SrcTransition {
    /**
     * 打包后
     * @param _content 文件内容
     */
    public static buildBack(_content: string): string {
        //处理路径
        _content = _content.replace(/import.*?["'](.*?)["'];/g, (text) => {
            if (Config.filePathModify && Config.filePathModify.length > 0) {
                for (let _o of Config.filePathModify) {
                    text = text.replace(/["'].*?["']/, (_text) => {
                        return _text.replace(_o.a, _o.b);
                    });
                }
            }
            return text;
        });
        //
        return _content;
    }
}