import path from "path";
import chalk from "chalk";
import portfinder from "portfinder";
import http from "http";
import mime from "mime";
import MainConfig from "../../config/MainConfig";
import HttpTool from "../../http/HttpTool";
import { crossDomainHead } from "../../com/ResHead";
import { rollup } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import node_polyfills from 'rollup-plugin-node-polyfills';
import plugin_josn from '@rollup/plugin-json';

/** nm路径 */
let _NMUrl: string;
/**
 * 获取nm路径
 */
export function getNMUrl(): string {
    return _NMUrl || (_NMUrl = path.join(path.dirname(MainConfig.config.src), '/'));
}

/**
 * 根据npm包名获取包入口文件路径
 * @param _name 
 */
export function getNMIndexPath(_name: string): string {
    let _p: string = '';
    try {
        //根据当前npm包路径找到包入口文件路径
        _p = require.resolve(_name, { paths: [getNMUrl()] });
    } catch (e) {
        console.log(chalk.red('读取npm包入口文件时出错，可能没有安装这个包，详细错误如下：'));
        console.log(e);
    }
    //提取相对路径
    return _p;
}

/** npm包缓存文件 */
const _npmPackageCatch: { [index: string]: string } = {};
/** nm主机地址 */
let _nmHost: string = '';

/** rollup入口选项 */
const inputOptions: any = {
    input: '',
    // 打包插件
    plugins: [
        commonjs(),
        plugin_josn(),
        node_polyfills(),
        nodeResolve(),
    ]
};
/** rollup出口选项 */
const outputOptions: any = {
    name: '',
    /**
     *  amd – 异步模块定义，用于像RequireJS这样的模块加载器
        cjs – CommonJS，适用于 Node 和 Browserify/Webpack
        esm – 将软件包保存为 ES 模块文件，在现代浏览器中可以通过 <script type=module> 标签引入
        iife – 一个自动执行的功能，适合作为<script>标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
        umd – 通用模块定义，以amd，cjs 和 iife 为一体
        system - SystemJS 加载器格式
     */
    format: 'esm',
    exports: 'default',
    sourcemap: false,
    /** 注入的内容 */
    banner: `

/** 注入预制内容 */

//* 注入process
var process = {
    env: {
        NODE_ENV: 'production'
    }
};
//* 注入global
var global = (
        typeof global !== "undefined" ? global :
        typeof self !== "undefined" ? self :
        typeof window !== "undefined" ? window : {}
    );

/** 正式内容 */
    `,
};

/**
 * 开启node_modules服务
 */
export function server(): Promise<void> {
    //
    return portfinder.getPortPromise().then((port) => {
        //开启一个局域网服务
        http.createServer((rep, res) => {
            //获取包名
            let _name: string = rep.url.replace(/^[\/\\]/, '');
            //获取模块路径
            let _url: string = getNMIndexPath(_name);
            if (!_url) {
                res.writeHead(200, {
                    ...crossDomainHead,
                    'Content-Type': mime.getType('js') + ';charset=UTF-8',
                });
                res.end(`
                    alert('编译npm包错误@${_name}，可能是没有安装这个包导致的。');
                `);
                return;
            }
            switch (rep.method) {
                case 'GET':
                    res.writeHead(200, {
                        ...crossDomainHead,
                        'Content-Type': mime.getType('js') + ';charset=UTF-8',
                    });
                    if (_npmPackageCatch[_name]) {
                        res.end(_npmPackageCatch[_name]);
                        return;
                    }
                    //用rollup打包npm中的包
                    rollup({
                        ...inputOptions,
                        input: _url,
                    })
                        .then((bundle) => {
                            return bundle.generate({
                                ...outputOptions,
                                banner: `
//!注意这个文件是动态编译的，但是会被缓存起来。
//包入口文件路径@${_url}
${outputOptions.banner}
                                `,
                                name: _name,
                            });
                        })
                        .then(({ output }) => {
                            //获取打包后的代码
                            let _code: string = output[0].code;
                            //把改代码存入缓存
                            _npmPackageCatch[_name] = _code;
                            //
                            res.end(_code);
                        })
                        .catch((e) => {
                            res.writeHead(404, crossDomainHead);
                            res.end(e);
                            console.log(chalk.red('打包npm包时出错了，详细错误：'));
                            console.log(e);
                        });
                    //
                    break;
            }
        }).listen(port, HttpTool.getHostname);
        //设置nm主机地址
        _nmHost = `http://${HttpTool.getHostname}:${port}`;
    });
}

/**
 * 获取包url
 * @param _name 包名
 */
export function getNMIndexURL(_name: string): string {
    return `${_nmHost}/${_name}`;
}

/**
 * 获取nm主机地址
 */
export function nmHost(): string {
    return _nmHost;
}