import chalk from "chalk";
import MainConfig from "../../config/MainConfig";
import { getNMIndexURL } from "./NodeModulesT";

/** 匹配代码中的导入语句 */
const importReg: RegExp = /([\s])?import\s*([\w{}\s,]*?)\s*(?:from\s*)?["'](.*?)["'];?/g;
const requireReg: RegExp = /([\s])?(?:var|let|const|import)?\s*([\w{}\s,]*?)\s*=?\s*require\(\s*["'](.*?)['"]\s*\);?/g;

/** 内置loader列表 */
const Loaders: { [index: string]: ILoaderHandleFunction } = {
    /**
     * 路径处理loader
     */
    'path': function (_content: string, _absolutePath: string, _suffix: string): Promise<string> {
        /**
         * 处理路径
         * @param _ 占位。。。
         * @param $0 赋值表达式
         * @param $1 路径
         */
        let _f = (_, $_, $0, $1) => {
            //检测是否时npm的包，由字母数字，连字符组成
            if (/^[a-zA-Z0-9-]+$/.test($1)) {
                return `${$_ || ''}import "${getNMIndexURL($1)}";${($0 && $0 !== $1) ? `const ${$0} = ${$1};` : ''}`;
            }
            //处理路径
            else {
                if (MainConfig.config.filePathModify && MainConfig.config.filePathModify.length > 0) {
                    for (let _o of MainConfig.config.filePathModify) {
                        $1 = $1.replace(_o.a, _o.b);
                    }
                }
                return `${$_ || ''}import ${$0 && `${$0} from` || ''} "${$1}";`;
            }
        };
        //处理路径，先处理import再处理require
        _content = _content
            .replace(importReg, _f)
            .replace(requireReg, _f);
        //
        return Promise.resolve(_content);
    },

    /**
     * 文本处理插件
     */
    'txt': function (_content: string, _absolutePath: string, _suffix: string): Promise<string> {
        //需要转义反引号 `
        return Promise.resolve(`
    export default \`${_content.replace(/`/, '\\`')}\`;
            `);
    }
};

/**
 * loader处理
 * @param _loaders loader列表
 * @param _content 内容
 * @param _absolutePath 绝对路径
 * @param _suffix 后缀
 */
export async function LoaderHandle(_loaders: ILoaderConfig[], _content: string, _absolutePath: string, _suffix: string): Promise<string> {
    let _loaderF: ILoaderHandleFunction;
    let _names: string[];
    for (let _loaderConfig of _loaders) {
        _names = [_loaderConfig.name];
        //查找是否是需要处理的文件
        if (_loaderConfig.include.test(_absolutePath)) {
            for (let _loader of _loaderConfig.loader) {
                let __loaderF = (typeof _loader == 'string') ? (_names.push(_loader), Loaders[_loader]) : _loader;
                if (!__loaderF) { continue; }
                //包装一下__loaderF方法，主要是在这个loader出错时跳过这个loader
                _loaderF = ((...arg): any => {
                    return new Promise((r, e) => {
                        try {
                            __loaderF(...arg)
                                .then(r)
                                .catch((err) => {
                                    //loader处理出错了，跳过这个loader并打印粗错消息
                                    r(_content);
                                    //
                                    loaderErrHand(_names, err);
                                });
                        }
                        catch (err) {
                            //loader出错了，跳过这个loader并给出提示
                            r(_content);
                            //
                            loaderErrHand(_names, err);
                        }
                    });
                }) as ILoaderHandleFunction;
                //处理正真结果
                _content = await _loaderF(_content, _absolutePath, _suffix);
            }
        }
    }
    //
    return _content;
}

/**
 * loader异常处理
 * @param _names loader名字列表
 * @param err 错误
 */
function loaderErrHand(_names: string[], err: any) {
    let _name: string = '-> ';
    let _l: number = _names.length;
    _names.forEach((item, _i) => {
        _name += `${item}${_i < _l - 1 ? ' > ' : ''}`;
    });
    //
    console.log(chalk.red(`loader ${_name} 执行出错了，已跳过这个loader的执行:`));
    console.log(err);
}

/**
 * loader配置
 * 用于对匹配文件的额外处理，用来同步对应的打包系统保持，保持构建结果和打包结果的同步。
 * 默认的有path，txt两个loader用来处理ts文件的路径，和处理txt文件的导入。
 */
export interface ILoaderConfig {
    /** loader名字，打包出错时会给出提示 */
    name: string;
    /** 包含内容 */
    include: RegExp;
    /** loader */
    loader: (string | ILoaderHandleFunction)[];
}

/**
 * loader处理函数
 */
export interface ILoaderHandleFunction {
    (_content: string, _absolutePath: string, _suffix: string): Promise<string>;
}
