"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaderHandle = void 0;
const chalk_1 = __importDefault(require("chalk"));
const MainConfig_1 = __importDefault(require("../../config/MainConfig"));
const NodeModulesT_1 = require("./NodeModulesT");
const randomstring_1 = __importDefault(require("randomstring"));
/** 匹配代码中的导入语句 */
const importReg = /([\s])?import\s*([\w{}\s,\.\[\]\*]*?)\s*(?:from\s*)?["'](.*?)["'];?/g;
const requireReg = /([\s])?(?:var|let|const|import)?\s*([\w{}\s,\.\[\]\*]*?)\s*=?\s*require\(\s*["'](.*?)['"]\s*\);?/g;
/**
 * 获取导入路径
 * @param _ 占位。。。
 * @param $0 赋值表达式
 * @param $1 路径
 */
function getImportURL(_, $_, $0, $1) {
    //检测是否时npm的包，由字母开头且不是以src/开头
    if (/^[a-zA-Z]/.test($1) && !/^src\//.test($1)) {
        //换成npm服务的地址
        return _getImportURL($_, $0, NodeModulesT_1.getNMIndexURL($1), $1, true);
    }
    //处理路径
    else {
        //通过配置文件中的路径处理规则处理路径
        if (MainConfig_1.default.config.filePathModify && MainConfig_1.default.config.filePathModify.length > 0) {
            for (let _o of MainConfig_1.default.config.filePathModify) {
                $1 = $1.replace(_o.a, _o.b);
            }
        }
        return _getImportURL($_, $0, $1, $1);
    }
}
;
let _asReg = /^\*\s+as\s*/;
let __absolutePath = '';
let __getImportURLNumber_ = 0;
/** 返回最终的模块导入地址 */
function _getImportURL($_, $0, $1, _packageName, _ifNmpPackage = false) {
    if (_ifNmpPackage) {
        let _name = `__${randomstring_1.default.generate({
            length: 12,
            charset: 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'
        })}__${__getImportURLNumber_++}`;
        let _ifAs = _asReg.test($0);
        _ifAs && (console.log(chalk_1.default.yellow(`\n检测到文件@ ${__absolutePath} 导入npm包 ${_packageName} 时用到了as语法，本工具暂不支持该语法导入npm包呢，请改成常规语法导入。\n`)));
        $0 = $0.replace(_asReg, '').replace(/\s/g, '');
        if ($0) {
            //没有被{}包裹且带有,则需要拆分开
            if (/,/.test($0) && !/^\{.*?\}$/.test($0)) {
                let _$0 = $0;
                $0 = '';
                _$0.split(',').forEach((item) => {
                    item && ($0 += `const ${item} = ${_name};`);
                });
            }
            else {
                $0 = `const ${$0} = ${_name};`;
            }
        }
        return `${$_ || ''}import ${_name} from "${$1}";${$0}//⚠️ 这里是leb工具编译的，作者能力有限，只支持一些常见的导入写法导入npm的包呢，请谅解。🙏🙏🙏`;
    }
    else {
        return `${$_ || ''}import ${$0 && `${$0} from ` || ''}"${$1}";`;
    }
}
/** 内置loader列表 */
const Loaders = {
    /**
     * 路径处理loader
     */
    'path': function (_content, _absolutePath, _suffix) {
        __absolutePath = _absolutePath;
        //处理路径，先处理import再处理require
        _content = _content
            .replace(importReg, getImportURL)
            .replace(requireReg, getImportURL);
        //
        return Promise.resolve(_content);
    },
    /**
     * 文本处理插件
     */
    'txt': function (_content, _absolutePath, _suffix) {
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
function LoaderHandle(_loaders, _content, _absolutePath, _suffix) {
    return __awaiter(this, void 0, void 0, function* () {
        let _loaderF;
        let _names;
        for (let _loaderConfig of _loaders) {
            _names = [_loaderConfig.name];
            //查找是否是需要处理的文件
            if (_loaderConfig.include.test(_absolutePath)) {
                for (let _loader of _loaderConfig.loader) {
                    let __loaderF = (typeof _loader == 'string') ? (_names.push(_loader), Loaders[_loader]) : _loader;
                    if (!__loaderF) {
                        continue;
                    }
                    //包装一下__loaderF方法，主要是在这个loader出错时跳过这个loader
                    _loaderF = ((...arg) => {
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
                    });
                    //处理正真结果
                    _content = yield _loaderF(_content, _absolutePath, _suffix);
                }
            }
        }
        //
        return _content;
    });
}
exports.LoaderHandle = LoaderHandle;
/**
 * loader异常处理
 * @param _names loader名字列表
 * @param err 错误
 */
function loaderErrHand(_names, err) {
    let _name = '-> ';
    let _l = _names.length;
    _names.forEach((item, _i) => {
        _name += `${item}${_i < _l - 1 ? ' > ' : ''}`;
    });
    //
    console.log(chalk_1.default.red(`loader ${_name} 执行出错了，已跳过这个loader的执行:`));
    console.log(err);
}
//# sourceMappingURL=SrcLoader.js.map