//加载完成事件
window.addEventListener('load', function () {
    /** 提示框扩展 */
    const confirmEx = (function () {
        let _div = `
        <div class="confirmEx">
            <div class="bg"></div>
            <div class="content">
                <div class="mes">消息</div>
                <div class="but">
                    <button class="yes">确认✔️</button>
                    <button class="no">取消❌</button>
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
        let _bgDom = _confirmExDom.getElementsByClassName('bg')[0];
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
            if (_ifShow && event.key == 'Enter') {
                _backF && _backF(true);
                _hide();
            }
            if (_ifShow && event.key == 'Escape') {
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
        //整个元素
        _bgDom.onclick = () => {
            _backF && _backF(false);
            _hide();
        };
        //阻止背景板的点击事件冒泡
        _contentDom.onclick = (e) => {
            _backF && _backF(true);
            _hide();
            e.stopPropagation();
        }
        //确认按钮
        _yesButDom.onclick = (e) => {
            _backF && _backF(true);
            _hide();
            e.stopPropagation();
        };
        //取消按钮
        _noButDom.onclick = (e) => {
            _backF && _backF(false);
            _hide();
            e.stopPropagation();
        };
        return _show;
    })();

    //
    (function () {

        /** 项目更新次数 */
        let _updateNumber = 0;
        //是否有确认框在等待
        let _ifConfirm = false;

        //监听消息
        esbuildTool.webSocketT.instance.addEventListener("message", function (event) {
            let data = JSON.parse(event.data);
            let _mes = data.mes;
            let _type = data.type;
            //
            if (_type == esbuildTool.webSocketT.mesType.contentUpdate) {
                _updateNumber++;
                // 处理数据
                console.log(...esbuildTool.consoleEx.pack(esbuildTool.consoleEx.getStyle('#eeeeee', '#08d9d6'), _mes));
                //弹出提示框
                if (!_ifConfirm && _updateNumber > 0) {
                    _ifConfirm = true;
                    //
                    confirmEx(`
                        <div class="title">项目内容有更新 🔔</div>
                        <div class="content">点击消息框或点击确认按钮或按Enter键刷新页面，点击背景或取消按钮取消</div>
                    `, (flag) => {
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

        // 监听页面焦点事件
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
            }
            // 判断浏览器的支持情况 
            if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
                consol.warn("当前浏览器不能判断窗口是否获取或失去焦点😰");
            } else {
                // 监听visibilityChange事件    
                document.addEventListener(visibilityChange, () => {
                    if (document[hidden]) {
                        //失去焦点
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