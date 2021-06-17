"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crossDomainHead = void 0;
/**
 * 跨域请求头
 */
exports.crossDomainHead = {
    'Content-Type': 'application/javascript;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE',
    'Access-Control-Expose-Headers': 'Content-Type,*', //暴露出全部请求头参数
};
//# sourceMappingURL=ResHead.js.map