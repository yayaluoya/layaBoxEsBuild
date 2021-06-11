if ('serviceWorker' in navigator) {
    //直接打开sw工具
    navigator.serviceWorker.register('/sw.js').then(function (registration) {
        // Registration was successful
        console.log(
            ...esbuildTool.consoleEx.textPack(
                esbuildTool.consoleEx.getStyle('#8785a2', '#f4f6ff'),
                `ServiceWorker 注册成功✔️: 访问更快⚡`
            )
        );
    }, function (err) {
        // registration failed :(
        console.log(
            ...esbuildTool.consoleEx.textPack(
                esbuildTool.consoleEx.getStyle('#8785a2', '#f4f6ff'),
                `ServiceWorker 注册失败❌: ${err}`
            )
        );
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