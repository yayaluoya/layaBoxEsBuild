# LayaBoxEsBuild
[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/layabox-esbuild
[npm-url]: https://npmjs.org/package/layabox-esbuild
##  介绍

- #### 使用 esbuild 来增量构建 layabox 项目 修改代码后立即就能看到效果 提高开发速度，优化开发体验。

----------

## 关于 esBuild
- <a href="https://github.com/evanw/esbuild/">esbuild</a> 是一个用 Go 语言编写的用于打包，压缩 Javascript 代码的工具库。它最突出的特点就是速度极快，下图是 esbuild 跟 webpack, rollup, Parcel 等打包工具打包效率的一个比较:

  <img src="./res/contrast.png">
  图片取自 <a href="https://github.com/evanw/esbuild/">esbuild Github 仓库</a>。
  
  为什么它能做到那么快？
  
    它是用 Go 语言编写的。
    该语言可以编译为本地代码解析，生成最终打包文件和生成 source maps 的操作全部完全并行化，无需昂贵的数据转换，只需很少的几步即可完成所有操作。
    该库以提高编译速度为编写代码时的第一原则，并尽量避免不必要的内存分配。
    更多详细介绍，详见 Breword 翻译的 <a href="https://www.breword.com/evanw-esbuild">esbuild 官方文档</a>;

## 对比其它工具

| 工具类型     |                       简介                       | 修改代码后需要等多久才能刷新浏览器并看到修改后的效果 | 是否支持断点调试 |   推荐度   |
| :----------- | :----------------------------------------------: | :--------------------------------------------------: | :--------------: | :--------: |
| layaAir      |                   手动点击编译                   |                      一年，很慢                      |      不支持      | 强烈不推荐 |
| layaair2-cmd |        跟第一步差不多，就是加了个自动编译        |                       半年，慢                       |       支持       |   不推荐   |
| webpack      | 自动编译，功能强大，但是项目比较大的话还是会很慢 |                      一天，稍快                      |       支持       |    推荐    |
| **本工具**   |        自动构建，不编译，项目再大都没影响        |  0秒，飞快，切换到浏览器刷新的速度有多快它就有多快   |       支持       |  强烈推荐  |

## 安装

- npm安装。

    `npm i layabox-esbuild -g` 注意是全局安装，安装一次就行了。

## 命令

  <img src="./res/order.png">

- `layabox-esbuild -s`

    - 直接开始构建项目，当看到如下输出时就说明跑起来了。

        <img src="./res/home.png">

- `layabox-esbuild -c <url>`
    - 指定配置文件来构建项目。
    - 在项目根目录下创建 layaboxEsbuildConfig.js [位置，名字都可以随便，执行命令时参数填对就行了] 文件，然后导出一个满足IConfig接口的对象就行了，默认配置示例如下：

        ``` javascript
        /** 配置数据 */
        module.exports = {
            /** 代理src目录，可以是绝对路径或者相对路径 */
            src: './src/',
            /** 代理bin目录，可以是绝对路径或者相对路径 */
            bin: './bin/',
        };
        ```
    - 然后执行 `layabox-esbuild -c ./layaboxEsbuildConfig.js` 就可以以指定配置文件来构建项目了。
  
- `layabox-esbuild --log-config [url]`
    - 查看配置文件，如果不带后面的url参数则会打印默认的配置数据。示例：

        <img src="./res/config.png">

## 全部配置选项

``` javascript
/**
 * 配置接口
 */
export default interface IConfig {
    /** 代理src目录，可以是绝对路径或者相对路径 */
    src?: string,
    /** 代理bin目录，可以是绝对路径或者相对路径 */
    bin?: string,
    /** 文件路径修改，会把 a 匹配的替换成 b */
    filePathModify?: {
        a: RegExp,
        b: string,
    }[];
    /** 代理端口，可以随便指定，只要不冲突就行 */
    port?: {
        src: number,
        bin: number,
    },
    /** 入口文件名，地址相对于src目录 */
    mainTs?: string,
    /** 主页地址， 相对于bin目录 */
    homePage?: string,
    /** 主页脚本， 相对于bin目录 */
    homeJs?: string,
    /** 入口js文件，相对于bin目录 */
    mainJs?: string,
    /** 是否打印日志 */
    ifLog?: boolean,
    /** 是否启用webSocket工具 */
    ifOpenWebSocketTool?: boolean,
}
```

## 注意

- esbuild只是构建项目，不会把src的代码打包到bin/js/bundle.js文件里面而是缓存在内存中的，所以只能在开发环境中使用，最后再用laya的编译和打包，把代码都打包到bin/js/bundle.js文件中，它的作用只能体现再开发时，能更快的响应代码改动，不会影响最终laya编译的结果。

- 最好的方案是把webpack的增量编译一起打开，因为esbuild只是构建不编译，所以在补个webpack的增量编译就完美了，如果电脑卡的话就算了，最后上传代码时别忘了用laya或者webpack编译一下就行，不然bin/js/bundle.js是不会被更改的。