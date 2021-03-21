const { task } = require("gulp");
const { exec } = require("child_process");
const path = require('path');
const chalk = require('chalk');

//安装工具包
task('installTPack', function (f) {
    f();
    //
    let _pArray = [];
    //
    _pArray.push(new Promise((r) => {
        let _url = path.resolve(__dirname, '../esbuild');
        let _esbuild = exec(`cd ${_url} && npm install`);//打包工具
        _esbuild.stdout.on("data", (data) => {
            console.log(data);
        });
        _esbuild.stdout.on("end", (data) => {
            r();
        });
    }));
    //
    Promise.all(_pArray).then(() => {
        console.log(chalk.magenta('安装完成'));
    });
    //
});