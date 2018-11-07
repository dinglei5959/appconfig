/**
 * 是否为平板
 * @param plt
 */
export declare function isTablet(): boolean;
/**
* 加载script
* @param {String} url -- 链接
*/
export declare function loadScript(url: string): Promise<{}>;
/**
 * document的ready事件监听
 * @param {Function} [callback] - 回调函数
 * @return {Promise} - 返回promise，completed后自动解绑
 * */
export declare function docReady(callback: Function): any;
