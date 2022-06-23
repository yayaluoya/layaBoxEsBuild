"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbsolute = void 0;
const path_1 = __importDefault(require("path"));
/**
 * 获取绝对地址
 * @param _path
 * @returns
 */
function getAbsolute(_path) {
    if (path_1.default.isAbsolute(_path)) {
        return _path;
    }
    else {
        return path_1.default.join(process.cwd(), _path);
    }
}
exports.getAbsolute = getAbsolute;
//# sourceMappingURL=getAbsolute.js.map