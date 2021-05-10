"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

self.addEventListener('install', function (event) {// 处理安装步骤
  // console.log('sw install');
});
self.addEventListener('activate', function (event) {// 处理安装步骤
  // console.log('sw activate');
});
/** 版本字符串 */

var _v; //监听消息


self.addEventListener('message', function (event) {
  var _JSON$parse = JSON.parse(event.data),
      type = _JSON$parse.type,
      mes = _JSON$parse.mes; //


  switch (type) {
    //更新
    case 'update':
      var v = mes.v,
          webSocketUrl = mes.webSocketUrl; //查看外部版本和当前进程版本是否一致，不一致的话清空缓存，更新webSocket

      if (_v != v) {
        //
        cacheT.removeAll(); //先更新

        webSocketT.update(webSocketUrl); //在添加事件

        webSocketT.addMessageEventListener(function (event) {
          var data = JSON.parse(event.data);
          var _mes = data.mes;
          var _type = data.type; //
          // console.log('更新消息', _type);
          //更新脚本

          if (_type == 'scriptUpdate') {
            cacheT.remove(_mes);
          }
        });
      }

      _v = v; //

      break;
  }
}); //监听请求

self.addEventListener('fetch', function (event) {
  var _response; //在有版本的情况下先在缓存中找响应


  if (_v) {
    _response = cacheT.get(event.request.url);
  }

  if (!_response) {
    //发送请求
    _response = fetch(event.request).then(function (response) {
      //判断response的响应头，是否应该添加到缓存中。
      if (response.headers.has('file-only-key')) {
        // console.log('添加进缓存', response);
        //添加到缓存中，注意，必须添加克隆板，不然只能用一次，要判断当前webSocket有没有用，不然添加上去没法更新也没有意义
        if (webSocketT.usable) {
          cacheT.add(event.request.url, response.headers.get('file-only-key'), response.clone());
        }
      } //返回响应


      return response;
    });
  } //拦截请求


  event.respondWith(_response);
});
/**
 * webSocket工具
 */

var webSocketT = /*#__PURE__*/function () {
  function webSocketT() {
    _classCallCheck(this, webSocketT);
  }

  _createClass(webSocketT, null, [{
    key: "update",
    value:
    /** 实例 */

    /** 是否可用 */

    /**
     * 更新
     */
    function update(_url) {
      var _this = this;

      //先关闭之前的连接
      this.instance && this.instance.close();
      /** 开启新的连接 */

      this.instance = new WebSocket(_url);
      this.usable = true; //webSocket错误的回调

      this.instance.addEventListener('error', function () {
        console.error('webSocket出错啦！'); //清空所有缓存

        cacheT.removeAll(); //

        _this.usable = false;
      });
    }
    /**
     * 添加消息事件
     * @param {} _f 回调
     */

  }, {
    key: "addMessageEventListener",
    value: function addMessageEventListener(_f) {
      this.instance && this.instance.addEventListener("message", _f);
    }
  }]);

  return webSocketT;
}();
/**
 * 缓存工具
 * 缓存到进程内存中
 */


_defineProperty(webSocketT, "instance", void 0);

_defineProperty(webSocketT, "usable", void 0);

var cacheT = /*#__PURE__*/function () {
  function cacheT() {
    _classCallCheck(this, cacheT);
  }

  _createClass(cacheT, null, [{
    key: "get",
    value:
    /** 缓存内容，[_url,_key,_response][] */

    /**
     * 根据一个请求路径获取缓存
     * @param {*} _url 请求路径
     */
    function get(_url) {
      var _data = this.cache.find(function (item) {
        return item[0] == _url;
      }); //


      if (_data) {
        // console.log('从缓存中取得资源', _url);
        return _data[2].clone();
      }
    }
    /**
     * 添加一个缓存
     * @param {*} _url url
     * @param {*} _key 唯一键值
     * @param {*} _response 响应
     */

  }, {
    key: "add",
    value: function add(_url, _key, _response) {
      this.cache.push([_url, _key, _response]);
    }
    /**
     * 删除一个缓存
     * @param {*} _key 唯一键值
     */

  }, {
    key: "remove",
    value: function remove(_key) {
      var _index = this.cache.findIndex(function (item) {
        return item[1] == _key;
      });

      if (_index != -1) {
        // console.log('删除缓存');
        //
        this.cache.splice(_index, 1);
      }
    }
    /**
     * 删除所有缓存
     */

  }, {
    key: "removeAll",
    value: function removeAll() {
      this.cache.length = 0;
    }
  }]);

  return cacheT;
}();

_defineProperty(cacheT, "cache", []);