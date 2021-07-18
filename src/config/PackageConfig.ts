const package_ = require('../../package.json');
const ersion_ = require('../../packgeVersion.json');
/**
 * 包配置文件
 */
export default {
    package: package_,
    versionLog: ersion_,
} as {
    /** 包信息 */
    package: IPackageJson,
    /** 版本信息 */
    versionLog: IPackgeVersion,
};

/**
 * 包接口
 */
export interface IPackageJson {
    /** 项目名字 */
    name: string;
    /** 项目版本 */
    version: string;
    /** 拥有者名字 */
    authorName: string;
    /** 描述 */
    description: string;
    /** 仓库地址 */
    repository: string;
    /** 远程包json文件地址 */
    remotePackgeJsonFileUrl: string;
    /** 远程版本文件地址 */
    remotePackgeVersionJsonFileUrl: string;
}
/**
 * 包版本
 */
export interface IPackgeVersion {
    /** 版本日志 */
    versionLog: IVersionLog[];
}
/**
 * 版本日志接口
 */
export interface IVersionLog {
    /** 版本号 */
    v: string;
    /** 日志 */
    log: string;
    /** 类型 */
    type: 'bug' | 'opt';
    /** 程度 */
    degree: number;
}