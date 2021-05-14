"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
    var _console;

    // Registration was successful
    (_console = console).log.apply(_console, _toConsumableArray(esbuildTool.consoleEx.textPack(esbuildTool.consoleEx.getStyle('#8785a2', '#f4f6ff'), "ServiceWorker \u6CE8\u518C\u6210\u529F: ".concat(registration.scope))));
  }, function (err) {
    var _console2;

    // registration failed :(
    (_console2 = console).log.apply(_console2, _toConsumableArray(esbuildTool.consoleEx.textPack(esbuildTool.consoleEx.getStyle('#8785a2', '#f4f6ff'), "ServiceWorker \u6CE8\u518C\u5931\u8D25: ".concat(err))));
  }); //立刻发送一个版本设置事件，设置sw进程的版本

  swPostMes('update', {
    /** 版本 */
    v: esbuildTool.version,

    /** webSocket的地址 */
    webSocketUrl: esbuildTool.webSocketT.instance.url
  });
}