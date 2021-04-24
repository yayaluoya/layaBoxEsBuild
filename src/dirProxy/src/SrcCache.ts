import MainConfig from "../../config/MainConfig";
import URLT from "../../_T/URLT";
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
            if (_i > 0 && MainConfig.config.ifLog) {
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
        let _module: SrcModule = this.byUrlGetModule(URLT.join(MainConfig.config.src, _url));
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
     * 通过url获取模块，绝对路径
     * @param _url url
     */
    private static byUrlGetModule(_url: string): SrcModule {
        //判断是否包含后缀
        if (!/\.([^\.]*?)$/.test(_url)) {
            //加上默认后缀
            _url = `${_url}.${MainConfig.config.srcFileDefaultSuffix}`;
        }
        //
        _url = _url.replace(/\\/g, '/');
        //查找
        let _SrcModule: SrcModule = this.m_moduleCache.find((item) => {
            //* 不区分大小写匹配，并且要把路径中的\转意成/
            return new RegExp('^' + item.normPath + '$', 'i').test(_url);
        });
        //
        return _SrcModule;
    }
}