/** 提示框扩展 */
const confirmEx = (function () {
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
    //添加元素
    let _divDom = document.createElement("div");
    _divDom.innerHTML = _div;
    //
    _divDom = document.body.appendChild(_divDom.firstElementChild);
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
const ConsoleEx = (function () {
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

//
(function () {

    /** 项目更新次数 */
    let _updateNumber = 0;
    //是否有确认框在等待
    let _ifConfirm = false;

    //监听消息
    window._webSocket.addEventListener("message", function (event) {
        let data = JSON.parse(event.data);
        let _mes = data.mes;
        let _type = data.type;
        //
        if (_type == window._webSocketMesType.contentUpdate) {
            _updateNumber++;
            // 处理数据
            console.log(...ConsoleEx.pack(ConsoleEx.getStyle('#eeeeee', '#08d9d6'), _mes));
            //弹出提示框
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

    //监听页面焦点事件
    // window.addEventListener('visibilitychange', function () {
    //     //
    //     if (document['visible']) {
    //         // 失去焦点
    //     } else {
    //         // 获取焦点
    //         if (!_ifConfirm && _updateNumber > 0) {
    //             _ifConfirm = true;
    //             //
    //             confirmEx('项目内容有更新,点击确认或按Enter键刷新页面', (flag) => {
    //                 _updateNumber = 0;
    //                 _ifConfirm = false;
    //                 //判断状态
    //                 if (flag) {
    //                     //刷新页面
    //                     location.reload();
    //                 } else {
    //                     //
    //                     // console.log('取消');
    //                 }
    //             });
    //         }
    //     }
    // });
})();