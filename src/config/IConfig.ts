import { TransformOptions } from "esbuild";
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
    /** 主机地址，当有任何原因没有自动获取到主机地址时将采用这个地址 */
    hostName?: string,
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
    /** 断点类型 */
    breakpointType?: 'vscode' | 'browser',
    /** 是否启用webSocket工具 */
    ifOpenWebSocketTool?: boolean,
    /** 是否在启动时打开主页 */
    ifOpenHome?: boolean,
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
    loader?: ILoaderConfig[],
    /** 组合esbuild的配置文件 */
    comEsbuildConfig?: (config: TransformOptions) => TransformOptions,
    /** 
     * 文件读取后门
     * 系统读取不到目标文件时将会调用该方法
     * 使用该方法读取到的模块不会被缓存到内存中，故而不会有监听，如果有需要可以自行实现缓存和监听，然后调用_update方法更新页面就行了
     */
    fileReadBackDoor?: (_src: string, _update: (_url?: string) => void) => Promise<{
        /** 真实路径 */
        url?: string;
        /** 后缀 */
        su?: string;
        /** 异常 */
        err?: any;
        /** 数据 */
        data?: any;
    }>;
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