"use strict";

(function () {
  var _div = "\n        <div class=\"loading\">\n            <b>\n                \u52A0\u8F7D\u4E2D...\n            </b>\n            <p class=\"explain\">\n                ".concat(window.esbuildTool.packageJson.authorName, "/").concat(window.esbuildTool.packageJson.name, "\n            </p>\n            <p class=\"v\">\n                V: ").concat(window.esbuildTool.packageJson.version, "\n            </p>\n        </div>\n    "); //添加元素


  var _divDom = document.createElement("div");

  _divDom.innerHTML = _div; //

  _divDom = document.body.appendChild(_divDom.firstElementChild); //

  var _loadF = function _loadF() {
    //取消监听事件
    document.body.removeEventListener('load', _loadF); //删除元素

    document.body.removeChild(_divDom);
  }; //添加加载事件


  window.addEventListener('load', _loadF);
})();