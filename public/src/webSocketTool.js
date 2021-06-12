(function () {
    /** 获取websocket工具 */
    let webSocket = new WebSocket(esbuildTool.config.webSocketUrl);

    /**
     * webSocket消息类型
     */
    const webSocketMesType = {
        contentUpdate: 'contentUpdate',
        scriptUpdate: 'scriptUpdate',
    };

    //设置为全局工具
    esbuildTool.webSocketT = {
        instance: webSocket,
        mesType: webSocketMesType,
    };
})();