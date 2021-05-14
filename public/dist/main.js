"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
      /**
       * 文本包装
       * @param {*} _style 样式
       * @param {*} _text 文本内容
       */

    }, {
      key: "textPack",
      value: function textPack(_style, _text) {
        return ['%c%s', _style, _text];
      }
    }]);

    return ConsoleEx;
  }(); //


  return ConsoleEx;
}();

(function () {
  var _console;

  //添加全局工具
  var esbuildTool = {
    consoleEx: consoleEx,
    version: '${{v}}',
    //其中可能带有\所以需要转义一下
    packageJson: JSON.parse('{{packageJson}}')
  }; //

  window.esbuildTool = esbuildTool; //打印提示

  (_console = console).log.apply(_console, _toConsumableArray(esbuildTool.consoleEx.textPack(esbuildTool.consoleEx.getStyle('#8785a2', 'rgb(138 255 185 / 20%)'), "\u6B22\u8FCE\u4F7F\u7528layabox-esbuild\u6784\u5EFA\u5DE5\u5177\uFF0C\u8BE5\u5DE5\u5177\u53EA\u662F\u4E2A\u5916\u58F3\u4E0D\u4F1A\u4FEE\u6539\u9879\u76EE\u4EFB\u4F55\u5185\u5BB9\u3002\n\u5F53\u524D\u7248\u672C @".concat(esbuildTool.packageJson.version, " \u6700\u65B0\u7248\u672C\u8BF7\u67E5\u770B https://github.com/yayaluoya/layaBoxEsBuild.git"))));
})();