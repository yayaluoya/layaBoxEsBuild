/**
 * 跨域请求头
 */
export const crossDomainHead = {
    'Content-Type': 'application/javascript;charset=UTF-8',
    'Access-Control-Allow-Origin': '*', //跨域
    'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE', //跨域
    'Access-Control-Expose-Headers': 'Content-Type,*', //暴露出全部请求头参数
};

/**
 * 缓存一天的响应头
 */
export const cacheOneDayHead = {
    ...crossDomainHead,
    //缓存一天的时间
    // 'Cache-Control': 'max-age=86400',
};
