(function () {
    /** 获取websocket工具 */
    let webSocket = new WebSocket('ws://${{hostname}}:${{webSocketPort}}/');

    /**
     * webSocket消息类型
     */
    const webSocketMesType = (function () {
        return {
            contentUpdate: 'contentUpdate',
            scriptUpdate: 'scriptUpdate',
        };
    })();

    //设置为全局工具
    esbuildTool.webSocketT = {
        instance: webSocket,
        mesType: webSocketMesType,
    };
})();