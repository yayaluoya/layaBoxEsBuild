import MainConfig from "../../config/MainConfig";
import SrcModule from "./SrcModule";
import chalk from "chalk";
import { join } from "path";

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
        }, 1000 * 60 * MainConfig.config.autoUpdateTaskTime);
    }

    /**
     * 根据模块路径获取模块
     * @param _url 模块路径
     */
    public static getModule(_url: string): SrcModule {
        //是否从缓存里面拿
        let _ifCache: boolean = true;
        let _module: SrcModule = this.byUrlGetModule(join(MainConfig.config.src, _url));
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
        //
        this.byUrlGetModule(_url)?.update();
    }

    /**
     * 通过url获取模块，绝对路径
     * @param _url url
     */
    private static byUrlGetModule(_url: string): SrcModule {
        //把路径转成标准路径
        _url = _url.replace(/\\/g, '/');
        //查找
        return this.m_moduleCache.find((item) => {
            /** 不区分大小写匹配 */
            let _b: boolean = false;
            //
            let _sus: string[] = MainConfig.config.srcFileDefaultSuffixs;
            let _su: string;
            let _susRegExp: RegExp;
            for (let _i in _sus) {
                _su = _sus[_i];
                if (_su) {
                    _susRegExp = new RegExp(`\\.${_su}$`, 'i');
                    //先判断是否满足当前后缀的格式了，避免重复添加
                    _b = new RegExp(`^${item.normPath.replace(_susRegExp, '')}\\.${_su}$`, 'i').test(`${_url.replace(_susRegExp, '')}.${_su}`);
                } else {
                    _b = new RegExp(`^${item.normPath}$`, 'i').test(_url);
                }
                if (_b) break;
            }
            //
            return _b;
        });
    }
}