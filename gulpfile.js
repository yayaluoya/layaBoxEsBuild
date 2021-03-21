/**
 * 引入服务文件
 */
//laya打包
require("./.node/gulpfile/layaCompile.js");
//安装工具包
require("./.node/gulpfile/installTPack.js");

const { task } = require("gulp");

//多余命令

task('compile', (f) => {
    f();
    //
    console.log('\033[35m', '编译相关命令', '\033[0m');
});

task('publish', (f) => {
    f();
    //
    console.log('\033[35m', '打包相关命令', '\033[0m');
});

task('npm', (f) => {
    f();
    //
    console.log('\033[35m', 'npm相关命令', '\033[0m');
});