import MainConfig from "../../config/MainConfig";

/** 内置loader列表 */
export const Loaders: { [index: string]: ILoaderHandleFunction } = {
    /**
     * 路径处理loader
     */
    'path': function (_content: string, _absolutePath: string, _suffix: string): Promise<string> {
        //处理路径
        _content = _content.replace(/import.*?["'](.*?)["'];/g, (text, $1) => {
            let _$1: string = $1;
            if (MainConfig.config.filePathModify && MainConfig.config.filePathModify.length > 0) {
                for (let _o of MainConfig.config.filePathModify) {
                    _$1 = _$1.replace(_o.a, _o.b);
                }
            }
            //
            return text.replace($1, _$1);
        });
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
export default async function LoaderHandle(_loaders: ILoaderConfig[], _content: string, _absolutePath: string, _suffix: string): Promise<string> {
    let _loaderF: ILoaderHandleFunction;
    for (let _loaderConfig of _loaders) {
        //查找是否是需要处理的文件
        if (_loaderConfig.include.test(_absolutePath)) {
            for (let _loader of _loaderConfig.loader) {
                _loaderF = (typeof _loader == 'string') ? Loaders[_loader] : _loader;
                if (!_loaderF) { continue; }
                _content = await _loaderF(_content, _absolutePath, _suffix);
            }
        }
    }
    //
    return _content;
}

/**
 * loader处理函数
 */
export interface ILoaderHandleFunction {
    (_content: string, _absolutePath: string, _suffix: string): Promise<string>;
}

/**
 * loader配置
 */
export interface ILoaderConfig {
    /** 包含内容 */
    include: RegExp;
    /** loader */
    loader: (string | ILoaderHandleFunction)[];
}