"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectUtils = void 0;
/**
 * 对象工具类
 */
var ObjectUtils = /** @class */ (function () {
    function ObjectUtils() {
    }
    /**
     * 获取一个对象的属性
     * @param obj
     * @param key 目标属性，可以是字符串，方法，正则表达式
     */
    ObjectUtils.getPro = function (obj, key) {
        if (typeof obj != 'object') {
            return;
        }
        var is;
        for (var i in obj) {
            is = false;
            switch (true) {
                case typeof key == 'function':
                    is = key(i);
                    break;
                case key instanceof RegExp:
                    is = key.test(i);
                    break;
                default:
                    is = i == key;
                    break;
            }
            //
            if (is) {
                return obj[i];
            }
        }
    };
    /**
     * 克隆一个对象
     * 采用序列化和反序列化的方式，function不会被克隆
     * @param _O 该对象
     */
    ObjectUtils.clone = function (_data) {
        return JSON.parse(JSON.stringify(_data));
    };
    /**
     * 克隆一个对象
     * 递归克隆，包括原型链上的东西
     */
    ObjectUtils.clone_ = function (data) {
        var _this = this;
        if (typeof data == 'object' && data) {
            if (Array.isArray(data)) {
                return data.reduce(function (a, b) {
                    a.push(_this.clone_(b));
                    return a;
                }, []);
            }
            var _data_1 = {};
            Object.keys(data).forEach(function (key) {
                _data_1[key] = _this.clone_(data[key]);
            });
            //直接赋值原型
            Object.setPrototypeOf(_data_1, Object.getPrototypeOf(data));
            //
            return _data_1;
        }
        return data;
    };
    /**
     * 属性提取
     * @param {*} obj
     * @param {*} props
     */
    ObjectUtils.propGet = function (obj, props) {
        if (!Array.isArray(props)) {
            props = [props];
        }
        var o = {};
        for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
            var key = props_1[_i];
            o[key] = obj[key];
        }
        return o;
    };
    return ObjectUtils;
}());
exports.ObjectUtils = ObjectUtils;
//# sourceMappingURL=ObjectUtils.js.map