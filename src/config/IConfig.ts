import { ILoaderConfig } from "../dirProxy/src/SrcLoader";

/**
 * 配置表接口
 */
export default interface IConfig {
    /** 代理src目录，可以是绝对路径或者相对路径 */
    src?: string,
    /** 代理bin目录，可以是绝对路径或者相对路径 */
    bin?: string,
    /** 文件路径修改，会把 a 匹配的替换成 b */
    filePathModify?: {
        a: RegExp,
        b: string,
    }[];
    /** 代理端口，可以随便指定，为0则自动分配，只要不冲突就行 */
    port?: {
        src: number,
        bin: number,
    },
    /** src目录文件默认后缀，当导入的文件不带后缀时会以这个数组依次寻找，知道找到匹配的，全部找不到的话就报错  */
    srcFileDefaultSuffixs?: string[],
    /** 入口文件名，地址相对于src目录 */
    mainTs?: string,
    /** 主页地址， 相对于bin目录 */
    homePage?: string,
    /** 主页脚本， 相对于bin目录 */
    homeJs?: string,
    /** 入口js文件，相对于bin目录 */
    mainJs?: string,
    /** 自动更新任务时间，分 */
    autoUpdateTaskTime?: number,
    /** 是否打印日志 */
    ifLog?: boolean,
    /** 是否启用webSocket工具 */
    ifOpenWebSocketTool?: boolean,
    /** 是否立即刷新浏览器 */
    ifUpdateNow?: boolean,
    /** 文件监听 */
    fileWatch?: {
        /** src目录的监听配置，enable选项无效 */
        src: IFileWatch,
        /** bin目录的监听配置 */
        bin: IFileWatch,
    },
    /** loader列表 */
    loader?: ILoaderConfig[]
}

/**
 * 文件监听方式
 */
export interface IFileWatch {
    /** 是否启用 */
    enable: boolean;
    /** 是否使用轮询，使用轮询的话可能会导致cpu占用过高，不使用轮询的话可能会导致文件夹占用不能删除 */
    usePolling: boolean;
    /** 轮询间隔时间，usePolling=true有效 */
    interval: number;
}