/**
 * 对象工具类
 */
export class ObjectUtils {
    /**
     * 获取一个对象的属性
     * @param obj
     * @param key 目标属性，可以是字符串，方法，正则表达式
     */
    static getPro(obj: any, key: string | Function | RegExp) {
        if (typeof obj != 'object') {
            return;
        }
        let is;
        for (let i in obj) {
            is = false;
            switch (true) {
                case typeof key == 'function':
                    is = (key as Function)(i);
                    break;
                case key instanceof RegExp:
                    is = (key as RegExp).test(i);
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
    }
    /**
     * 克隆一个对象
     * 采用序列化和反序列化的方式，function不会被克隆
     * @param _O 该对象
     */
    static clone<T>(_data: T): T {
        return JSON.parse(JSON.stringify(_data));
    }

    /**
     * 克隆一个对象
     * 递归克隆，包括原型链上的东西
     */
    static clone_<T>(data: T): T {
        if (typeof data == 'object' && data) {
            if (Array.isArray(data)) {
                return data.reduce((a, b) => {
                    a.push(this.clone_(b));
                    return a;
                }, []);
            }
            let _data: T = {} as any;
            Object.keys(data).forEach((key) => {
                _data[key] = this.clone_(data[key]);
            });
            //直接赋值原型
            Object.setPrototypeOf(_data, Object.getPrototypeOf(data));
            //
            return _data;
        }
        return data;
    }

    /**
     * 属性提取
     * @param {*} obj 
     * @param {*} props 
     */
    static propGet(obj, props) {
        if (!Array.isArray(props)) {
            props = [props];
        }
        let o = {};
        for (let key of props) {
            o[key] = obj[key];
        }
        return o;
    }
}