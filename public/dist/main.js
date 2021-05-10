"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//打印工具扩展
var consoleEx = function () {
  /**
   * 输出包装类
   */
  var ConsoleEx = /*#__PURE__*/function () {
    function ConsoleEx() {
      _classCallCheck(this, ConsoleEx);
    }

    _createClass(ConsoleEx, null, [{
      key: "getStyle",
      value:
      /**
       * 获取样式
       * @param _color 字体颜色
       * @param _bgColor 背景颜色
       */
      function getStyle(_color, _bgColor) {
        return "\n                   color: ".concat(_color, ";\n                   background-color: ").concat(_bgColor, ";\n                   padding: 0px 3px;\n                   border-radius: 3px;\n                   line-height: 15px;\n                   ");
      }
      /**
       * 包装信息
       * @param _style 样式
       * @param _par 参数
       */

    }, {
      key: "pack",
      value: function pack(_style, _par) {
        return ['%c%s', _style, 'EB', _par];
      }
    }]);

    return ConsoleEx;
  }(); //


  return ConsoleEx;
}();

(function () {
  //添加全局工具
  var esbuildTool = {
    consoleEx: consoleEx,
    version: '${{v}}',
    //其中可能带有\所以需要转义一下
    packageJson: JSON.parse('{{packageJson}}')
  }; //

  window.esbuildTool = esbuildTool;
})();