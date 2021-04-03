/** 提示框扩展 */
const confirmEx = (() => {
    let _div = `
        <div class="confirmEx">
            <div class="content">
                <div class="mes">消息</div>
                <div class="but">
                    <button class="yes">确认</button>
                    <button class="no">取消</button>
                </div>
            </div>
        </div>
    `;
    let _style = `
        .confirmEx{
            width: 100vw;
            height: 100vh;
            position: fixed;
            top: 0px;
            left: 0px;
            background-color: rgb(0 0 0 / 60%);
            display: none;
        }
        .confirmEx.show{
            display: flex;
            flex-wrap: nowrap;
            align-content: center;
            justify-content: center;
            align-items: center;
            animation: 1s show;
        }

        .confirmEx>.content{
            background-color: #222831;
            display: flex;
            flex-direction: column;
            width: 250px;
            border-radius: 5px;
            padding: 10px;
            border: 3px solid #eeeeee;
        }
        .confirmEx>.content>.mes{
            font-size: 25px;
            color: #eeeeee;
            padding-bottom: 5px;
            border-bottom: 1px dashed #393e46;
        }
        .confirmEx>.content>.but{
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: space-around;
            flex-direction: row;
            align-content: center;
            padding-top: 5px;
        }
        .confirmEx>.content>.but>button{
            cursor: pointer;
            width: 110px;
            border: 0px;
            border-radius: 3px;
            height: 35px;
            font-size: 20px;
            font-weight: bold;
            background-color: #393e46;
            color: #eeeeee;
            letter-spacing: 3px;
            transition: all .15s;
        }
        .confirmEx>.content>.but>button:hover{
            background-color: #eeeeee;
            color: #222831;
        }
        .confirmEx>.content>.but>button:active{
            font-size: 18px;
            letter-spacing: 2px;
            background-color: white;
            color: #222831;
        }
    `;
    //添加元素
    let _divDom = document.createElement("div");
    _divDom.innerHTML = _div;
    var _styleDom = document.createElement("style");
    _styleDom.type = "text/css";
    _styleDom.innerHTML = _style;
    //
    document.getElementsByTagName('body')[0].appendChild(_divDom);
    document.getElementsByTagName('body')[0].appendChild(_styleDom);
    //获取各个元素
    let _confirmExDom = document.getElementsByClassName('confirmEx')[0];
    let _contentDom = _confirmExDom.getElementsByClassName('content')[0];
    let _mesDom = _confirmExDom.getElementsByClassName('mes')[0];
    let _yesButDom = _confirmExDom.getElementsByClassName('yes')[0];
    let _noButDom = _confirmExDom.getElementsByClassName('no')[0];
    //是否显示
    let _ifShow = false;
    //回调函数
    let _backF;
    //添加键盘事件
    window.addEventListener('keydown', (event) => {
        if (_ifShow && event.keyCode == 13) {
            _backF && _backF(true);
            _hide();
        }
        if (_ifShow && event.keyCode == 27) {
            _backF && _backF(false);
            _hide();
        }
    });
    //显示的方法
    let _show = (mes, _f) => {
        _ifShow = true;
        _confirmExDom.classList.add('show');
        //
        _backF = _f;
        _mesDom.innerHTML = mes;
    };
    //隐藏的方法
    let _hide = () => {
        _ifShow = false;
        _confirmExDom.classList.remove('show');
    };
    //阻止背景板的点击事件冒泡
    _contentDom.onclick = (e) => {
        e.stopPropagation();
    }
    _confirmExDom.onclick = () => {
        _backF && _backF(false);
        _hide();
    };
    _yesButDom.onclick = (e) => {
        _backF && _backF(true);
        _hide();
    };
    _noButDom.onclick = (e) => {
        _backF && _backF(false);
        _hide();
    };
    return _show;
})();

//
const ConsoleEx = (() => {
    /**
     * 输出包装类
     */
    class ConsoleEx {
        /**
         * 获取样式
         * @param _color 字体颜色
         * @param _bgColor 背景颜色
         */
        static getStyle(_color, _bgColor) {
            return `
                   color: ${_color};
                   background-color: ${_bgColor};
                   padding: 0px 3px;
                   border-radius: 3px;
                   line-height: 15px;
                   `
        }

        /**
         * 包装信息
         * @param _style 样式
         * @param _par 参数
         */
        static pack(_style, _par) {
            return ['%c%s', _style, 'EB', _par];
        }
    }
    //
    return ConsoleEx;
})();

/**
 * webSocket消息类型
 */
const webSocketMesType = (() => {
    return {
        contentUpdate: 'contentUpdate',
    };
})();

//
(() => {
    //
    let webSocket = new WebSocket('ws://localhost:3063/');

    /** 项目更新次数 */
    let _updateNumber = 0;
    //是否有确认框在等待
    let _ifConfirm = false;

    //监听消息
    webSocket.addEventListener("message", function (event) {
        let data = JSON.parse(event.data);
        let _mes = data.mes;
        let _type = data.type;
        //
        if (_type == webSocketMesType.contentUpdate) {
            _updateNumber++;
            // 处理数据
            console.log(...ConsoleEx.pack(ConsoleEx.getStyle('#eeeeee', '#08d9d6'), _mes));
        }
    });

    //监听页面焦点事件
    window.addEventListener('visibilitychange', function () {
        //
        if (document['visible']) {
            // 失去焦点
        } else {
            // 获取焦点
            if (!_ifConfirm && _updateNumber > 0) {
                _ifConfirm = true;
                //
                confirmEx('项目内容有更新,点击确认或按Enter键刷新页面', (flag) => {
                    _updateNumber = 0;
                    _ifConfirm = false;
                    //判断状态
                    if (flag) {
                        //刷新页面
                        location.reload();
                    } else {
                        //
                        // console.log('取消');
                    }
                });
            }
        }
    });
})();