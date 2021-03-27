import Config from "src/config/Config";

const reRegExpChar = /[\\"'()[\]{}|]/g;
const reHasRegExpChar = RegExp(reRegExpChar.source);
/**
 * Escapes the `RegExp` special characters "\", """, "'",
 * "(", ")", "[", "]", "{", "}", and "|" in `string`.
 *
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 *
 */
function escapeRegExp(string) {
    return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : (string || '');
}

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

    /**
     * 普通文件打包后
     * @param _content 文件内容
     */
    public static textBuildBack(_content): string {
        //转义
        _content = escapeRegExp(_content);
        return `
export default "${_content}";
        `;
    }
}