import Config from "./config/Config";
import FileOperation from "./file/FileOperation";
import Init from "./Init";
import ResURL from "./_T/ResURL";
const chalk = require('chalk');
const http = require('http');


//先初始化项目
Init.init().then(() => {
    // req 请求， res 响应 
    const app = http.createServer(function (req, res) {
        //设置跨域
        res.writeHead(200, {
            'Content-Type': 'application/javascript;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE'
        })
        //get请求
        if (req.method === 'GET') {
            //解析出路径
            let _url: string = req.url;
            //
            FileOperation.getFile(_url).then((data) => {
                //返回数据
                res.end(data);
            });
        }
        //post请求
        else if (req.method === 'POST') {
            //
            res.end('不支持post请求。');
        }
    });
    //设置端口
    app.listen(3060);
    //提示
    // console.log('后端路径', ResURL.rootURL);
    console.log('代理路径 ', ResURL.srcURL);
    console.log(chalk.magenta('主页地址 ', Config.home));
});