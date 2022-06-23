import path from "path";

/**
 * 获取绝对地址
 * @param _path 
 * @returns 
 */
export function getAbsolute(_path: string) {
    if (path.isAbsolute(_path)) {
        return _path;
    } else {
        return path.join(process.cwd(), _path);
    }
}