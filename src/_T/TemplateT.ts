/**
 * 模板工具
 */
export default class TemplateT {
    /**
     * 替换模板变量
     * @param _content 源字符串
     * @param _o 目标变量
     */
    public static ReplaceVariable(
        _content: string,
        _o: { [_index: string]: string | object },
    ): string {
        return _content.replace(/\$\$([a-zA-Z]+)/g, (_, b) => {
            return typeof _o[b] == 'object' ? JSON.stringify(_o[b]) : (_o[b] as string);
        });
    }
}
