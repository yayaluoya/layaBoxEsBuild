import Config from "src/config/Config";
import SrcModule from "./SrcModule";
var chalk = require('chalk');

/**
 * Src目录缓存
 */
export default class SrcCache {
    /** 文件模块缓存列表 */
    private static m_moduleCache: SrcModule[] = [];

    /**
     * 初始化
     */
    public static init() {
        //添加计时器，每过一段时间自动更新所有版本变化的模块
        setInterval(() => {
            if (this.m_moduleCache.length == 0) { return; }
            let _i: number = 0;
            this.m_moduleCache.forEach((item) => {
                item.autoUpdateTask() ? _i++ : false;
            });
            if (_i > 0 && Config.ifLog) {
                console.log(chalk.gray('>'));
                console.log(chalk.gray('预构建所有已修改模块->', _i));
            }
        }, 1000 * 60 * 3);
    }

    /**
     * 根据模块路径获取模块
     * @param _url 模块路径
     */
    public static getModule(_url: string): SrcModule {
        //是否从缓存里面拿
        let _ifCache: boolean = true;
        let _module: SrcModule = this.byUrlGetModule(_url);
        if (!_module) {
            _ifCache = false;
            _module = new SrcModule(_url);
            this.m_moduleCache.push(_module);
        }
        // console.log('获取模块', _url, _ifCache);
        return _module;
    }

    /**
     * 更新模块
     * @param _url 模块路径，包含后缀的格式
     */
    public static updateModule(_url: string) {
        // console.log('准备更新模块', _url, this.m_moduleCache.map((item) => {
        //     return item.url;
        // }));
        this.byUrlGetModule(_url)?.update();
    }

    /**
     * 通过url获取模块
     * @param _url url
     */
    private static byUrlGetModule(_url: string): SrcModule {
        //是否包含后缀
        let _ifSuffix: boolean = /\..*?$/.test(_url);
        //查找
        let _SrcModule: SrcModule = this.m_moduleCache.find((item) => {
            return (_ifSuffix ? new RegExp(`^${item.url + '.' + item.suffix}$`, 'i') : new RegExp(`^${item.url}$`, 'i')).test(_url);
        });
        //
        // console.log('更新模块', _url, _SrcModule && _SrcModule.url);
        //
        return _SrcModule;
    }
}