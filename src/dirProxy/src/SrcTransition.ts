import MainConfig from "../../config/MainConfig";

/**
 * Src文件过渡操作
 * 当从本地读取文件的是否会经过这个流程
 */
export default class SrcTransition {
    /**
     * ts文件打包后
     * @param _content 文件内容
     */
    public static tsBuildBack(_content: string): string {
        //处理路径
        _content = _content.replace(/import.*?["'](.*?)["'];/g, (text, $1) => {
            let _$1: string = $1;
            if (MainConfig.config.filePathModify && MainConfig.config.filePathModify.length > 0) {
                for (let _o of MainConfig.config.filePathModify) {
                    _$1 = _$1.replace(_o.a, _o.b);
                }
            }
            //
            return text.replace($1, _$1);
        });
        //
        return _content;
    }

    /**
     * 普通文件打包后
     * @param _content 文件内容
     */
    public static textBuildBack(_content: string): string {
        //需要转义反引号 `
        return `
export default \`${_content.replace(/`/, '\\`')}\`;
        `;
    }
}