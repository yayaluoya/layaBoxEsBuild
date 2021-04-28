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
    }
    //
    return ConsoleEx;
})();

(function () {
    //添加全局工具
    const esbuildTool = {
        consoleEx: consoleEx,
        version: '${{v}}',
        packageJson: JSON.parse(`\${{packageJson}}`),
    };
    //
    window.esbuildTool = esbuildTool;
})();