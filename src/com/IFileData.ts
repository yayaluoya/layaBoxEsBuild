/**
 * 文件数据
 */
export default interface IFileData {
    /** 文件内容 */
    content: Buffer;
    /** 状态码 */
    stateCode: number;
    /** 响应头 */
    resHead: any;
}
