self.addEventListener('install', function (event) {
    // 处理安装步骤
    // console.log('sw install');
});
self.addEventListener('activate', function (event) {
    // 处理安装步骤
    // console.log('sw activate');
});

/** esbuild配置 */
let Config;

//监听消息
self.addEventListener('message', function (event) {
    let { type, mes } = JSON.parse(event.data);
    //
    switch (type) {
        //初始化
        case 'update':
            //查看外部版本和当前进程版本是否一致，不一致的话清空缓存，更新webSocket
            if (!Config || mes.version != Config.version) {
                cacheT.removeAll();
                webSocketT.update(mes.webSocketUrl);
                //在添加事件
                webSocketT.addMessageEventListener((event) => {
                    let data = JSON.parse(event.data);
                    // console.log('更新消息', _type);
                    //更新脚本
                    if (data.type == 'scriptUpdate') {
                        cacheT.remove(data.mes);
                    }
                });
            }
            //重置配置信息
            Config = mes;
            //
            break;
        //关闭
        case 'close':
            cacheT.removeAll();
            webSocketT.instance && webSocketT.instance.close();
            //取消请求代理
            self.removeEventListener('fetch', fetchEvent);
            break;
    }
});

/** 请求事件 */
function fetchEvent(event) {
    let request = event.request;
    let _response;
    //在有配置的情况下先在缓存中找响应
    if (Config) {
        _response = cacheT.get(request.url);
        //用webScocket模拟http请求，避开浏览器http请求并发限制
        if (!_response) {
            //检测是否是脚本请求
            let _regExp = new RegExp(`^${Config.mainURL}`);
            if (_regExp.test(request.url)) {
                _response = webSocketT.fetch(request.url.replace(_regExp, ''))?.then((response) => {
                    return cacheT.addResponse(request, response);
                });
            }
        }
    }
    //如果还是没找到则直接发送一个http请求
    if (!_response) {
        //发送请求
        _response = fetch(request).then((response) => {
            return cacheT.addResponse(request, response);
        });
    }
    //拦截请求
    event.respondWith(
        _response,
    );
}
//监听请求
self.addEventListener('fetch', fetchEvent);

/**
 * webSocket工具
 */
class webSocketT {
    /** 实例 */
    static instance = null;
    /** 是否可用 */
    static usable = false;
    /** 请求任务列表 */
    static m_fetchTaskList = [];

    /**
     * 更新
     */
    static update(_url) {
        //重置请求
        this.m_fetchTaskList.length = 0;
        //先关闭之前的连接
        this.instance && this.instance.close();
        /** 开启新的连接 */
        this.instance = new WebSocket(_url);
        this.usable = true;
        //webSocket错误的回调
        this.instance.addEventListener('error', () => {
            console.error('webSocket出错啦！😱');
            //清空所有缓存
            cacheT.removeAll();
            //
            this.usable = false;
        });
        //添加一个用来模拟http请求的回调
        this.addMessageEventListener((event) => {
            let data = JSON.parse(event.data);
            //判断是不是请求
            if (data.type == 'fetch') {
                this._fetch(data.mes);
            }
        });
    }

    /**
     * 发送一个用webSocket模拟的http请求
     * @param {*} _url 请求地址
     */
    static fetch(_url) {
        if (!this.usable || this.instance.readyState != 1) { return null; }
        let _key = this.getFetchKey();
        return new Promise((r) => {
            //添加到任务
            this.m_fetchTaskList.push({
                key: _key,
                resolve: r,
            });
            //发送请求
            this.instance.send(JSON.stringify({
                type: 'fetch',
                mes: {
                    url: _url,
                    key: _key,
                },
            }));
        });
    }
    //
    static _fetch(_data) {
        let { key, body, head, stateCode } = _data;
        let _index = this.m_fetchTaskList.findIndex((item) => {
            return item.key == key;
        });
        if (_index != -1) {
            this.m_fetchTaskList[_index].resolve(new Response(body, { headers: head, status: stateCode }));
            //删除任务
            this.m_fetchTaskList.splice(_index, 1);
        } else {
            console.error('模拟http请求出错，建议重启工具。');
        }
    }
    //
    static getFetchKeyNumber = 0;
    static getFetchKey() {
        return btoa(`${Date.now()}:${this.getFetchKeyNumber++}:${Math.random()}`);
    }

    /**
     * 添加消息事件
     * @param {} _f 回调
     */
    static addMessageEventListener(_f) {
        this.usable && this.instance.addEventListener("message", _f);
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
        //全部转成统一的路径
        _url = _url.replace(/\\/g, '/');
        let _data = this.cache.find((item) => {
            //不区分大小写匹配
            return new RegExp(`^${item[0]}$`, 'i').test(_url);
        });
        //
        if (_data) {
            // console.log('从缓存中取得资源', _url);
            return _data[2].clone();
        }
    }

    /**
     * 添加响应
     * @param {*} request 请求
     * @param {*} response 响应
     * @returns 原响应
     */
    static addResponse(request, response) {
        //判断response的响应头，是否应该添加到缓存中。
        if (response.headers.has('file-only-key')) {
            // console.log('添加进缓存', response);
            //添加到缓存中，注意，必须添加克隆板，不然只能用一次，要判断当前webSocket有没有用，不然添加上去没法更新也没有意义
            if (webSocketT.usable) {
                this.add(request.url, response.headers.get('file-only-key'), response.clone());
            }
        }
        //返回响应
        return response;
    }

    /**
     * 添加一个缓存
     * @param {*} _url url
     * @param {*} _key 唯一键值
     * @param {*} _response 响应
     */
    static add(_url, _key, _response) {
        //全部转成统一的路径
        _url = _url.replace(/\\/g, '/');
        //如果有缓存的话就先删除,确保只有一个缓存与后端文件对应
        this.remove(_key);
        //
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
            console.log('%c%s', 'color: #8785a2;', `> 删除sw废弃缓存文件@${this.cache[_index][0].replace(/[a-z]+:\/\/[a-zA-Z0-9\.]+:?[0-9]*/, '')} ✖️`);
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