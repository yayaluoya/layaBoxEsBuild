const { readFileSync } = require("fs");
const { join } = require("path");

/** 配置数据 */
module.exports = {
    /** 代理src目录，可以是绝对路径或者相对路径 */
    src: './test/src/',
    /** 代理bin目录，可以是绝对路径或者相对路径 */
    bin: './test/bin/',
    /** 是否在启动时打开主页 */
    ifOpenHome: false,
    /** 是否打印log */
    // ifLog: true,
    // breakpointType: 'vscode',
    //
    // src: 'F:/word/LayaMiniGame/src/',
    // bin: 'F:/word/LayaMiniGame/bin/',
    async fileReadBackDoor(_path) {
        let _url = join(__dirname, 'test', _path) + '.ts';
        let _data = readFileSync(_url);
        return {
            // url: _url,
            //su: 'ts',
            err: '哈哈哈',
            data: _data,
        };
    },
};