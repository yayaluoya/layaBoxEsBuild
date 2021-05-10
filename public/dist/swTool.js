"use strict";

if ('serviceWorker' in navigator) {
  /** 向sw发送消息 */
  var swPostMes = function swPostMes(_type, _mes) {
    var _navigator$serviceWor, _navigator$serviceWor2;

    (_navigator$serviceWor = navigator.serviceWorker) === null || _navigator$serviceWor === void 0 ? void 0 : (_navigator$serviceWor2 = _navigator$serviceWor.controller) === null || _navigator$serviceWor2 === void 0 ? void 0 : _navigator$serviceWor2.postMessage(JSON.stringify({
      type: _type,
      mes: _mes
    }));
  };

  //直接打开sw工具
  navigator.serviceWorker.register('/sw.js').then(function (registration) {
    // Registration was successful
    console.log('ServiceWorker 注册成功: ', registration.scope);
  }, function (err) {
    // registration failed :(
    console.log('ServiceWorker 注册失败: ', err);
  }); //立刻发送一个版本设置事件，设置sw进程的版本

  swPostMes('update', {
    /** 版本 */
    v: esbuildTool.version,

    /** webSocket的地址 */
    webSocketUrl: esbuildTool.webSocketT.instance.url
  });
}