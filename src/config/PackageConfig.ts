const package_ = require('../../package.json');
/**
 * 包配置文件
 */
export default {
    package: package_,
} as {
    /** 包信息 */
    package: IPackageJson;
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
}
