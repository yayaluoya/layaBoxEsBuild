"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
/**
 * 路径工具
 */
var URLT = /** @class */ (function () {
    function URLT() {
    }
    /**
     * 将所有参数连接在一起，并规范化结果路径。
     * 参数必须是字符串。
     * 在v0.8中，非字符串参数被无声地忽略。
     * 在v0.10及以上版本中，会抛出异常。
     * @param paths url列表
     */
    URLT.join = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        var _url = path_1.join.apply(void 0, paths);
        return _url;
    };
    /**
     * 获取绝对路径
     * @param pathSegments
     */
    URLT.resolve = function () {
        var pathSegments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pathSegments[_i] = arguments[_i];
        }
        return path_1.resolve.apply(void 0, pathSegments);
    };
    Object.defineProperty(URLT, "sep", {
        /** 文件分隔符。“\”或“/” */
        get: function () {
            return path_1.sep;
        },
        enumerable: false,
        configurable: true
    });
    return URLT;
}());
exports.default = URLT;
//# sourceMappingURL=URLT.js.map