/**
 * 监听 存放订阅者的信息
 * @param key --
 * @param cb -- 处理函数
 * @param cache -- 命名空间 的访问key
 */
export declare function _listen(key: string, cb: Function, cache?: object): void;
/**
 * 触发事件
 */
export declare function _trigger(): any;
export declare function _remove(key: any, cache: any, fn?: any): void;
export declare function _create(namespace?: string): any;
declare const _default: {
    create: typeof _create;
    one: (key: any, fn: any, last: any) => void;
    remove: (key: any, fn: any) => void;
    listen: (key: any, fn: any, last?: any) => void;
    trigger: (name?: string | undefined) => void;
};
export default _default;
