/** 
 * 下划线工具实例接口
 * 中文文档 https://underscorejs.net/
 */
interface IUnderscore {
    [index: string]: any;

    //collections

    each(obj: any, f: Function): any;
    each(obj: any, f: Function, context: any): any;
    forEach(obj: any, f: Function): any;
    forEach(obj: any, f: Function, context: any): any;

    map(obj: any, f: Function): any[];
    map(obj: any, f: Function, context: any): any[];
    collect(obj: any, f: Function): any[];
    collect(obj: any, f: Function, context: any): any[];

    reduce(obj: any, f: Function, memo: any): any;
    reduce(obj: any, f: Function, memo: any, context: any): any;
    inject(obj: any, f: Function, memo: any): any;
    inject(obj: any, f: Function, memo: any, context: any): any;
    foldl(obj: any, f: Function, memo: any): any;
    foldl(obj: any, f: Function, memo: any, context: any): any;

    reduceRight(obj: any, f: Function, memo: any): any;
    reduceRight(obj: any, f: Function, memo: any, context: any): any;
    foldr(obj: any, f: Function, memo: any): any;
    foldr(obj: any, f: Function, memo: any, context: any): any;

    find(obj: any, f: Function): any;
    find(obj: any, f: Function, context: any): any;
    detect(obj: any, f: Function): any;
    detect(obj: any, f: Function, context: any): any;

    reject(obj: any, f: Function): any[];
    reject(obj: any, f: Function, context: any): any[];

    filter(obj: any, f: Function): any[];
    filter(obj: any, f: Function, context: any): any[];
    select(obj: any, f: Function): any[];
    select(obj: any, f: Function, context: any): any[];

    all(obj: any, f: Function): boolean;
    all(obj: any, f: Function, context: any): boolean;
    every(obj: any, f: Function): boolean;
    every(obj: any, f: Function, context: any): boolean;

    any(obj: any): boolean;
    any(obj: any, f: Function): boolean;
    any(obj: any, f: Function, context: any): boolean;
    some(obj: any): boolean;
    some(obj: any, f: Function): boolean;
    some(obj: any, f: Function, context: any): boolean;

    include(obj: any, f: Function): boolean;
    contains(obj: any, f: Function): boolean;

    invoke(obj: any, f: Function): any[];
    invoke(obj: any, f: Function, args: any[]): any[];

    pluck(obj: any, prop: string): any[];

    max(obj: number[]): number;
    max(obj: number[], context: any): number;

    min(obj: number[]): number;
    min(obj: number[], context: any): number;

    sortBy(obj: any, f: Function): any[];
    sortBy(obj: any, f: Function, context: any): any[];

    groupBy(obj: any, f: Function): any[];

    sortedIndex(obj: any, f: Function): any[];
    sortedIndex(obj: any, f: Function, iter: Function): any[];

    shuffle(obj: any[]): any[];
    sample(obj: any[], n?: number): any[];
    toArray(obj: any[]): any[];
    size(obj: any[]): number;

    //array
    first(obj: any[]): any;
    head(obj: any[]): any;

    last(obj: any[]): any;

    rest(obj: any[]): any[];
    tail(obj: any[]): any[];

    compact(obj: any[]): any[];

    flatten(obj: any[]): any[];
    flatten(obj: any[], shallow: number): any[];

    without(obj: any[]): any[];
    intersection(...obj: any[]): any[];
    difference(...obj: any[]): any[];

    uniq(obj: any[]): any[];
    unique(obj: any[]): any[];

    zip(...obj: any[]): any[];
    indexOf(obj: any[], val: any): any;
    range(stop: number): number[];
    range(start: number, stop: number): number[];
    range(start: number, stop: number, step: number): number[];

    //object
    keys(obj: any): string[];
    values(obj: any): any[];
    functions(obj: any): string[];
    extend(obj: any, ...sources: any[]): any;
    pick(obj: any, ...keys: string[]): any;
    defaults(obj: any, ...defaults: any[]): any;
    clone(obj: any): any;
    tap(obj: any, intercepter: Function): any;
    has(obj: any, key: string): boolean;

    //functions
    bind(f: Function, obj: Object): void;
    bind(f: Function, obj: Object, ...args: string[]): void;
    bindAll(obj: Object, ...methodNames: string[]): void;
    memoize(f: Function): any;
    memoize(f: Function, ...hashFunctions: any[]): any;

    delay(f: Function, wait: number): any;
    delay(f: Function, wait: number, ...arguments: any[]): any;
    defer(f: Function): any;
    defer(f: Function, ...arguments: any[]): any;
    throttle(f: Function, wait: number): any;
    debounce(f: Function, wait: number): any;
    debounce(f: Function, wait: number, ...immediate: any[]): any;
    once(f: Function): any;
    after(count: number, f: Function): any;
    wrap(f: Function, wrapper: Function): any;
    compose(...fs: Function[]): Function;

    //isX
    isEqual(obj: any, other: any): boolean;
    isEmpty(obj: any): boolean;
    isElement(obj: any): boolean;
    isArray(obj: any): boolean;
    isObject(obj: any): boolean;
    isArguments(obj: any): boolean;
    isFunction(obj: any): boolean;
    isString(obj: any): boolean;
    isNumber(obj: any): boolean;
    isFinite(obj: any): boolean;
    isbooleanean(obj: any): boolean;
    isDate(obj: any): boolean;
    isRegExp(obj: any): boolean;
    isNaN(obj: any): boolean;
    isNull(obj: any): boolean;
    isUndefined(obj: any): boolean;

    //utility
    noConflict(): boolean;
    identity(x: any): any;
    times(n: number, f: Function): void;
    mixin(obj: any): void;
    uniqueId(prefix: string[]): string;
    escape(str: string): string;
    result(obj: any, key: string): any;
    template(template: string, bindings: any): string;

    //chaining
    chain(obj: any): any;
    //value is useless
}

/**
 * 下划线工具实例
 */
declare const _: IUnderscore;