//打印工具扩展
const consoleEx = (function () {
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

        /**
         * 文本包装
         * @param {*} _style 样式
         * @param {*} _text 文本内容
         */
        static textPack(_style, _text) {
            return ['%c%s', _style, _text];
        }
    }
    //
    return ConsoleEx;
})();

(function () {
    //添加全局工具
    const esbuildTool = {
        consoleEx: consoleEx,
        version: '${{v}}',
        //其中可能带有\所以需要转义一下
        packageJson: JSON.parse('{{packageJson}}'),
    };
    //
    window.esbuildTool = esbuildTool;
    //打印提示
    console.log(
        ...esbuildTool.consoleEx.textPack(
            esbuildTool.consoleEx.getStyle('#8785a2', '#f4f6ff'),
            `欢迎使用layabox-esbuild构建工具，该工具只是个外壳不会修改项目任何内容。\n当前版本 @${esbuildTool.packageJson.version} 最新版本请查看 https://github.com/yayaluoya/layaBoxEsBuild.git`
        )
    );
})();