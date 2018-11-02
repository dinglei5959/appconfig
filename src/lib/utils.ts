import { pad } from './platform-type';


/**
 * 是否为平板
 * @param plt 
 */
export function isTablet(): boolean {
  let smallest = Math.min(this.getWidth(), this.getHeight());
  let largest = Math.max(this.getWidth(), this.getHeight());
  const matchSize = (smallest > 460 && smallest < 1100) &&
    (largest > 780 && largest < 1400);

  const matchUa = this.userAgent.indexOf(pad) > -1 ;
  return matchSize && matchUa;
}

 /**
 * 加载script
 * @param {String} url -- 链接
 */
export function loadScript(url:string) {
  return new Promise((resolve, reject) => {
    let _head = document.getElementsByTagName('head')[0];
    let _script = document.createElement('script');
    _script.setAttribute('type', 'text/javascript');
    _script.setAttribute('src', url);
    _head.appendChild(_script);
    _script.onload = function() {
      resolve();
    };
    _script.onerror = function(err) {
      reject(err);
    };
  });
}

  /**
   * document的ready事件监听
   * @param {Function} [callback] - 回调函数
   * @return {Promise} - 返回promise，completed后自动解绑
   * */
export function  docReady (callback:Function) {
  let promise = null; // Promise;

  if (!callback) {
    // a callback wasn't provided, so let's return a promise instead
    promise = new Promise(function(resolve) {
      callback = resolve;
    });
  }

  /* istanbul ignore else */
  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', completed, false);
    window.addEventListener('load', completed, false);
  }

  /* istanbul ignore next */
  function completed() {
    document.removeEventListener('DOMContentLoaded', completed, false);
    window.removeEventListener('load', completed, false);
    callback();
  }

  return promise;
}
