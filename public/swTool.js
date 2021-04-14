if ('serviceWorker' in navigator) {
    //在文档加载完成后开始打开sw工具
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
        //监听消息
        esbuildTool.webSocketT.instance.addEventListener("message", function (event) {
            let data = JSON.parse(event.data);
            let _mes = data.mes;
            let _type = data.type;
            //
            if (_type == esbuildTool.webSocketT.mesType.scriptUpdate) {
                swPostMes('scriptUpdate', _mes);
            }
        });
    });

    //立刻发送一个版本设置事件，设置sw进程的版本
    swPostMes('v', esbuildTool.version);

    /** 向sw发送消息 */
    function swPostMes(_type, _mes) {
        navigator.serviceWorker?.controller?.postMessage(JSON.stringify({
            type: _type,
            mes: _mes,
        }));
    }
}