self.addEventListener('install', function (event) {
    // 处理安装步骤
    // console.log('sw install');
});
self.addEventListener('activate', function (event) {
    // 处理安装步骤
    // console.log('sw activate');
});

/** 版本字符串 */
let _v;

//监听消息
self.addEventListener('message', function (event) {
    let { type, mes } = JSON.parse(event.data);
    //
    switch (type) {
        //更新
        case 'update':
            let { v, webSocketUrl } = mes;
            //查看外部版本和当前进程版本是否一致，不一致的话清空缓存，更新webSocket
            if (_v != v) {
                //
                cacheT.removeAll();
                //先更新
                webSocketT.update(webSocketUrl);
                //在添加事件
                webSocketT.addMessageEventListener((event) => {
                    let data = JSON.parse(event.data);
                    let _mes = data.mes;
                    let _type = data.type;
                    //
                    // console.log('更新消息', _type);
                    //更新脚本
                    if (_type == 'scriptUpdate') {
                        cacheT.remove(_mes);
                    }
                });
            }
            _v = v;
            //
            break;
    }
});

//监听请求
self.addEventListener('fetch', function (event) {
    let _response;
    //在有版本的情况下先在缓存中找响应
    if (_v) {
        _response = cacheT.get(event.request.url);
    }
    if (!_response) {
        //发送请求
        _response = fetch(event.request).then((response) => {
            //判断response的响应头，是否应该添加到缓存中。
            if (response.headers.has('file-only-key')) {
                // console.log('添加进缓存', response);
                //添加到缓存中，注意，必须添加克隆板，不然只能用一次，要判断当前webSocket有没有用，不然添加上去没法更新也没有意义
                if (webSocketT.usable) {
                    cacheT.add(event.request.url, response.headers.get('file-only-key'), response.clone());
                }
            }
            //返回响应
            return response;
        });
    }
    //拦截请求
    event.respondWith(
        _response,
    );
});

/**
 * webSocket工具
 */
class webSocketT {
    /** 实例 */
    static instance;
    /** 是否可用 */
    static usable;

    /**
     * 更新
     */
    static update(_url) {
        //先关闭之前的连接
        this.instance && this.instance.close();
        /** 开启新的连接 */
        this.instance = new WebSocket(_url);
        this.usable = true;
        //webSocket错误的回调
        this.instance.addEventListener('error', () => {
            console.error('webSocket出错啦！');
            //清空所有缓存
            cacheT.removeAll();
            //
            this.usable = false;
        });
    }

    /**
     * 添加消息事件
     * @param {} _f 回调
     */
    static addMessageEventListener(_f) {
        this.instance && this.instance.addEventListener("message", _f);
    }
}

/**
 * 缓存工具
 * 缓存到进程内存中
 */
class cacheT {
    /** 缓存内容，[_url,_key,_response][] */
    static cache = [];

    /**
     * 根据一个请求路径获取缓存
     * @param {*} _url 请求路径
     */
    static get(_url) {
        let _data = this.cache.find((item) => {
            return item[0] == _url;
        });
        //
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
    static add(_url, _key, _response) {
        this.cache.push([_url, _key, _response]);
    }

    /**
     * 删除一个缓存
     * @param {*} _key 唯一键值
     */
    static remove(_key) {
        let _index = this.cache.findIndex((item) => {
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
    static removeAll() {
        this.cache.length = 0;
    }
}