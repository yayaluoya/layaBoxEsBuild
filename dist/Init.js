"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BinWatch_1 = require("./dirProxy/bin/BinWatch");
const SrcCache_1 = require("./dirProxy/src/SrcCache");
const SrcWatch_1 = require("./dirProxy/src/SrcWatch");
const WebSocket_1 = require("./webSocket/WebSocket");
/**
 * 初始化
 */
class Init {
    /**
     * 初始化项目
     */
    static init() {
        return new Promise((r) => __awaiter(this, void 0, void 0, function* () {
            //开启webSocket
            yield WebSocket_1.default.start();
            //开启文件监听
            SrcWatch_1.default.start();
            BinWatch_1.default.start();
            //开启缓存自动更新计时器
            SrcCache_1.default.init();
            //
            r();
        }));
    }
}
exports.default = Init;
//# sourceMappingURL=Init.js.map