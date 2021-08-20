"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheOneDayHead = exports.crossDomainHead = void 0;
/**
 * 跨域请求头
 */
exports.crossDomainHead = {
    'Content-Type': 'application/javascript;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE',
    'Access-Control-Expose-Headers': 'Content-Type,*', //暴露出全部请求头参数
};
/**
 * 缓存一天的响应头
 */
exports.cacheOneDayHead = __assign({}, exports.crossDomainHead);
//# sourceMappingURL=ResHead.js.map