(function () {
    /** 获取websocket工具 */
    let webSocket = new WebSocket('ws://${{hostname}}:${{webSocketPort}}/');

    //设置为全局工具
    window._webSocket = webSocket;

    /**
     * webSocket消息类型
     */
    const webSocketMesType = (function () {
        return {
            contentUpdate: 'contentUpdate',
        };
    })();

    //
    window._webSocketMesType = webSocketMesType;
})();