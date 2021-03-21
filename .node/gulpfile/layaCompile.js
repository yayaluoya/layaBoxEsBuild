const { watch, task, src } = require("gulp");
const { exec } = require("child_process");
const { server, reload } = require("gulp-connect");
const rev = require("gulp-rev-append");
const chalk = require('chalk');

/** 编译配置 */
const LayaAirCompileConfig = require("../config/LayaAirCompileConfig");
const { getLocalIP } = require("./_T");

//是否正在编译
let _ifCompile = false;
//主页地址
let _homePage;
//记录时间
let _time = 0;
//记录自动唤醒编译时间
let _awakeTime = 0;
//
//创建laya增量编译
task("layaCompile_", function (f) {
    f();
    console.log(chalk.magenta('开启LayaAir增量编译。。。'));
    //自动编译
    compile((code, signal) => {
        console.log(chalk.magenta('正在创建服务。。。'));
        //获取ip
        let _ip = getLocalIP();
        //主页地址
        _homePage = '游戏主页: http://' + _ip + ':' + LayaAirCompileConfig.port + LayaAirCompileConfig.homepage;
        //新建一个服务
        server({
            name: LayaAirCompileConfig.itemName,//项目名字
            livereload: LayaAirCompileConfig.livereload,//
            port: LayaAirCompileConfig.port,//端口
            root: LayaAirCompileConfig.root,//默认路径
            host: _ip,
            //建立服务完成
            serverInit: (_server) => {
                console.log(chalk.red('----▶ ' + _homePage));
                console.log(' --');
                console.log(chalk.red(' ----▷ 按 F5 键启动 DeBug浏览器，并打开 游戏主页 地址'));
                console.log(' -');

                /**
                 * @ 监听src目录下的所有子目录的所有文件，
                 * @ //
                 * @ 监听生效后执行的函数
                 */
                watch(LayaAirCompileConfig.watchFileList, undefined, watchCompile);

                //创建一个自动编译
                autoCompile();
            },
        });
    });
});

/** 监听编译 */
function watchCompile(cb) {
    let _onTime = (new Date()).getTime();
    console.log(chalk.yellow('监听到文件变化'));
    if (_onTime - _time >= LayaAirCompileConfig.watchFileDelay) {
        console.log(chalk.magenta('开始编译。。。'));
        _time = _onTime;
        _awakeTime = LayaAirCompileConfig.autoAwakeCompileTime;
    } else {
        return;
    }
    //开始编译
    compile((code, signal) => {
        // console.log(code, signal);
        //抛出提示
        console.log(chalk.red('----▶ ' + _homePage));
        if (LayaAirCompileConfig.ifAutoUpdate) {
            //重新刷新页面
            src(LayaAirCompileConfig.indexPage)
                .pipe(rev())
                .pipe(reload());
        }
        //
        cb();
    });
}

/** 自动编译 */
function autoCompile() {
    if (!LayaAirCompileConfig.ifAutoAwakeCompile) {
        return;
    }
    //
    _awakeTime = LayaAirCompileConfig.autoAwakeCompileTime;
    //开启自动唤醒计时器
    setInterval(_autoCompile, 100);
}
//配合自动编译
function _autoCompile() {
    //判断是否正在编译中
    if (_ifCompile) { return; }
    _awakeTime -= 100;
    // console.log(_awakeTime);
    if (_awakeTime <= 0) {
        _awakeTime = LayaAirCompileConfig.autoAwakeCompileTime;
        console.log('\n ----▷ 自动唤醒编译');
        compile((code, signal) => {
            console.log('\n ----▷ 自动唤醒编译完成');
            console.log(code, signal);
            //抛出提示
            console.log(chalk.magenta('----▶ ' + _homePage));
        });
    }
}

//创建laya编译
task("layaCompile", function (f) {
    f();
    //直接编译
    compile(() => {
        //
    });
});

/** 编译代码 */
function compile(_back) {
    if (_ifCompile) {
        console.log(chalk.red('正在编译中。。。'));
        return;
    }
    _ifCompile = true;
    //
    let process = exec("layaair2-cmd compile");
    process.stdout.on("data", (data) => {
        console.log(data);
    });
    process.stderr.on("data", (data) => {
        console.log(data);
    });
    process.on("exit", (code, signal) => {
        _ifCompile = false;
        console.log(chalk.green('----▷ 编译完成', new Date().toLocaleString()));
        _back(code, signal);
    });
}