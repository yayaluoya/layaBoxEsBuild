"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//加载完成事件
window.addEventListener('load', function () {
  /** 提示框扩展 */
  var confirmEx = function () {
    var _div = "\n        <div class=\"confirmEx\">\n            <div class=\"bg\"></div>\n            <div class=\"content\">\n                <div class=\"mes\">\u6D88\u606F</div>\n                <div class=\"but\">\n                    <button class=\"yes\">\u786E\u8BA4</button>\n                    <button class=\"no\">\u53D6\u6D88</button>\n                </div>\n            </div>\n        </div>\n    "; //添加元素

    var _divDom = document.createElement("div");

    _divDom.innerHTML = _div; //

    _divDom = document.body.appendChild(_divDom.firstElementChild); //获取各个元素

    var _confirmExDom = document.getElementsByClassName('confirmEx')[0];

    var _bgDom = _confirmExDom.getElementsByClassName('bg')[0];

    var _contentDom = _confirmExDom.getElementsByClassName('content')[0];

    var _mesDom = _confirmExDom.getElementsByClassName('mes')[0];

    var _yesButDom = _confirmExDom.getElementsByClassName('yes')[0];

    var _noButDom = _confirmExDom.getElementsByClassName('no')[0]; //是否显示


    var _ifShow = false; //回调函数

    var _backF; //添加键盘事件


    window.addEventListener('keydown', function (event) {
      if (_ifShow && event.keyCode == 13) {
        _backF && _backF(true);

        _hide();
      }

      if (_ifShow && event.keyCode == 27) {
        _backF && _backF(false);

        _hide();
      }
    }); //显示的方法

    var _show = function _show(mes, _f) {
      _ifShow = true;

      _confirmExDom.classList.add('show'); //


      _backF = _f;
      _mesDom.innerHTML = mes;
    }; //隐藏的方法


    var _hide = function _hide() {
      _ifShow = false;

      _confirmExDom.classList.remove('show');
    }; //整个元素


    _bgDom.onclick = function () {
      _backF && _backF(false);

      _hide();
    }; //阻止背景板的点击事件冒泡


    _contentDom.onclick = function (e) {
      _backF && _backF(true);

      _hide();

      e.stopPropagation();
    }; //确认按钮


    _yesButDom.onclick = function (e) {
      _backF && _backF(true);

      _hide();

      e.stopPropagation();
    }; //取消按钮


    _noButDom.onclick = function (e) {
      _backF && _backF(false);

      _hide();

      e.stopPropagation();
    };

    return _show;
  }(); //


  (function () {
    /** 项目更新次数 */
    var _updateNumber = 0; //是否有确认框在等待

    var _ifConfirm = false; //监听消息

    esbuildTool.webSocketT.instance.addEventListener("message", function (event) {
      var data = JSON.parse(event.data);
      var _mes = data.mes;
      var _type = data.type; //

      if (_type == esbuildTool.webSocketT.mesType.contentUpdate) {
        var _console;

        _updateNumber++; // 处理数据

        (_console = console).log.apply(_console, _toConsumableArray(esbuildTool.consoleEx.pack(esbuildTool.consoleEx.getStyle('#eeeeee', '#08d9d6'), _mes))); //弹出提示框


        if (!_ifConfirm && _updateNumber > 0) {
          _ifConfirm = true; //

          confirmEx("\n                        <div class=\"title\">\u9879\u76EE\u5185\u5BB9\u6709\u66F4\u65B0</div>\n                        <div class=\"content\">\u70B9\u51FB\u6D88\u606F\u6846\u6216\u70B9\u51FB\u786E\u8BA4\u6309\u94AE\u6216\u6309Enter\u952E\u5237\u65B0\u9875\u9762\uFF0C\u70B9\u51FB\u80CC\u666F\u6216\u53D6\u6D88\u6309\u94AE\u53D6\u6D88</div>\n                    ", function (flag) {
            _updateNumber = 0;
            _ifConfirm = false; //判断状态

            if (flag) {
              //刷新页面
              location.reload();
            } else {//
              // console.log('取消');
            }
          });
        }
      }
    }); // 监听页面焦点事件

    if ($ifUpdateNow) {
      //根据不同浏览器获取属性名称
      var hidden, visibilityChange;

      if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
      } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
      } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
      } // 判断浏览器的支持情况 


      if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
        consol.warn("当前浏览器不能判断窗口是否获取或失去焦点");
      } else {
        // 监听visibilityChange事件    
        document.addEventListener(visibilityChange, function () {
          if (document[hidden]) {//失去焦点
          } else {
            // 获取焦点
            if (_updateNumber > 0) {
              //刷新页面
              location.reload();
            }
          }
        }, false);
      }
    }
  })();
});