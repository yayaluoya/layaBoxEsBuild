"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
/**
 * 路径工具
 */
class URLT {
    /**
     * 将所有参数连接在一起，并规范化结果路径。
     * 参数必须是字符串。
     * 在v0.8中，非字符串参数被无声地忽略。
     * 在v0.10及以上版本中，会抛出异常。
     * @param paths url列表
     */
    static join(...paths) {
        let _url = path_1.join(...paths);
        return _url;
    }
    /**
     * 通过一个路径获取另一个路径
     * @param pathSegments
     */
    static resolve(...pathSegments) {
        return path_1.resolve(...pathSegments);
    }
    /** 文件分隔符。“\”或“/” */
    static get sep() {
        return path_1.sep;
    }
}
exports.default = URLT;
//# sourceMappingURL=URLT.js.map