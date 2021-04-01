import BinProxy from "./binProxy/BinProxy";
import Config from "./config/Config";
import Init from "./Init";
import SrcProxy from "./srcProxy/SrcProxy";
const chalk = require('chalk');

//先初始化项目
Init.init().then(() => {
    //代理src
    SrcProxy.start();
    //代理bin
    BinProxy.start();
    //提示
    console.log(chalk.green('主页地址:'), chalk.magenta('http://localhost:' + Config.port.bin));
});