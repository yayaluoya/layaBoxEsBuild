if ('serviceWorker' in navigator) {
    //在文档加载完成后开始打开sw工具
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker 注册成功: ', registration.scope);
        }, function (err) {
            // registration failed :(
            console.log('ServiceWorker 注册失败: ', err);
        });
    });

    //立刻发送一个版本设置事件，设置sw进程的版本
    swPostMes('update', {
        /** 版本 */
        v: esbuildTool.version,
        /** webSocket的地址 */
        webSocketUrl: esbuildTool.webSocketT.instance.url,
    });

    /** 向sw发送消息 */
    function swPostMes(_type, _mes) {
        navigator.serviceWorker?.controller?.postMessage(JSON.stringify({
            type: _type,
            mes: _mes,
        }));
    }
}