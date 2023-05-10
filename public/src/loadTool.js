(function () {
    let _div = `
        <div class="loading">
            <b>
                加载中🚀...
            </b>
            <p class="explain">
                ${esbuildTool.config.packageJson.authorName}/${esbuildTool.config.packageJson.name}
            </p>
            <p class="v">
                V: ${esbuildTool.config.packageJson.version}
            </p>
        </div>
    `;
    //添加元素
    let _divDom = document.createElement('div');
    _divDom.innerHTML = _div;
    //
    _divDom = document.body.insertBefore(
        _divDom.firstElementChild,
        document.body.firstElementChild,
    );
    //
    let _loadF = () => {
        //取消监听事件
        document.body.removeEventListener('load', _loadF);
        //删除元素
        document.body.removeChild(_divDom);
    };
    //添加加载事件
    window.addEventListener('load', _loadF);
})();
