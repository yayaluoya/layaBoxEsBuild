(()=>{function e(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function n(e,n){for(var t=0;t<n.length;t++){var a=n[t];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function t(e,t,a){return t&&n(e.prototype,t),a&&n(e,a),e}function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}var r;self.addEventListener("install",(function(e){})),self.addEventListener("activate",(function(e){})),self.addEventListener("message",(function(e){var n=JSON.parse(e.data),t=n.type,a=n.mes;switch(t){case"update":var s=a.v,o=a.webSocketUrl;r!=s&&(c.removeAll(),i.update(o),i.addMessageEventListener((function(e){var n=JSON.parse(e.data),t=n.mes;"scriptUpdate"==n.type&&c.remove(t)}))),r=s}})),self.addEventListener("fetch",(function(e){var n;r&&(n=c.get(e.request.url)),n||(n=fetch(e.request).then((function(n){return n.headers.has("file-only-key")&&i.usable&&c.add(e.request.url,n.headers.get("file-only-key"),n.clone()),n}))),e.respondWith(n)}));var i=function(){function n(){e(this,n)}return t(n,null,[{key:"update",value:function(e){var n=this;this.instance&&this.instance.close(),this.instance=new WebSocket(e),this.usable=!0,this.instance.addEventListener("error",(function(){console.error("webSocket出错啦！😱"),c.removeAll(),n.usable=!1}))}},{key:"addMessageEventListener",value:function(e){this.instance&&this.instance.addEventListener("message",e)}}]),n}();a(i,"instance",void 0),a(i,"usable",void 0);var c=function(){function n(){e(this,n)}return t(n,null,[{key:"get",value:function(e){e=e.replace(/\\/g,"/");var n=this.cache.find((function(n){return new RegExp("^".concat(n[0],"$"),"i").test(e)}));if(n)return n[2].clone()}},{key:"add",value:function(e,n,t){e=e.replace(/\\/g,"/"),this.remove(n),this.cache.push([e,n,t])}},{key:"remove",value:function(e){var n=this.cache.findIndex((function(n){return n[1]==e}));-1!=n&&(console.log("%c%s","color: #8785a2;","> 删除sw废弃缓存文件@".concat(this.cache[n][0].replace(/[a-z]+:\/\/[a-zA-Z0-9\.]+:?[0-9]*/,"")," ✖️")),this.cache.splice(n,1))}},{key:"removeAll",value:function(){this.cache.length=0}}]),n}();a(c,"cache",[])})();