/* appconfigure version 1.0.0 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.platForm = factory());
}(this, (function () { 'use strict';

  /**
   * @description
   * 改版后的订阅模式是有命名空间的 默认是放在 DEFUALTNAMESPACE下
   * 所以_listen已经变成三个 参数  key  cb  加 空间名
   *
   */
  var DEFUALTNAMESPACE = 'default';
  var namespaceCache = {};
  var _unshift = Array.prototype.unshift;
  function each(stack, fn) {
      var ret;
      for (var i = 0, l = stack.length; i < l; i++) {
          var stackFun = stack[i];
          ret = fn.call(stackFun, i, stackFun);
      }
      return ret;
  }
  /**
   * 监听 存放订阅者的信息
   * @param key --
   * @param cb -- 处理函数
   * @param cache -- 命名空间 的访问key
   */
  function _listen(key, cb, cache) {
      if (cache === void 0) { cache = {}; }
      if (!(key in cache)) {
          cache[key] = [];
      }
      cache[key].push(cb);
  }
  /**
   * 触发事件
   */
  function _trigger() {
      var cache = Array.prototype.shift.call(arguments);
      var key = Array.prototype.unshift.call(arguments);
      var args = arguments;
      var scope = this;
      var stack = cache[key]; // 缓存订阅的方法库
      if (!stack || !stack.length) {
          return;
      }
      return each(stack, function () {
          //这里涉及到一个高级用法   希望  stack 里面的函数每个 都能使用
          this.apply(scope, args); // this 指向的是 stack里面的函数 所以能直接执行
      });
  }
  function _remove(key, cache, fn) {
      if (cache[key]) {
          if (fn) {
              for (var i = cache[key].length; i >= 0; i--) {
                  if (cache[key][i] === fn) {
                      cache[key].splice(i, 1);
                  }
              }
          }
          else {
              cache[key] = [];
          }
      }
  }
  function _create(namespace) {
      namespace = namespace || DEFUALTNAMESPACE;
      var cache = {};
      var offlineStack = []; // 离线事件
      var ret = {
          listen: function (key, fn, last) {
              _listen(key, fn, cache);
              if (offlineStack === null) {
                  return;
              }
              //最后模式
              if (last === 'last') {
                  offlineStack.length && offlineStack.pop()();
              }
              else {
                  each(offlineStack, function () {
                      this();
                  });
              }
              offlineStack = null;
          },
          one: function (key, fn, last) {
              _remove(key, cache);
              this.listen(key, fn, last);
          },
          remove: function (key, fn) {
              _remove(key, cache, fn);
          },
          trigger: function () {
              var fn, args, _self = this;
              _unshift.call(arguments, cache);
              args = arguments;
              fn = function () {
                  return _trigger.apply(_self, args);
              };
              if (offlineStack) {
                  return offlineStack.push(fn);
              }
              return fn();
          }
      };
      return namespace
          ? namespaceCache[namespace]
              ? namespaceCache[namespace]
              : (namespaceCache[namespace] = ret)
          : ret;
  }
  var event = {
      create: _create,
      one: function (key, fn, last) {
          var event = this.create();
          event.one(key, fn, last);
      },
      remove: function (key, fn) {
          var event = this.create();
          event.remove(key, fn);
      },
      listen: function (key, fn, last) {
          var event = this.create();
          event.listen(key, fn, last);
      },
      trigger: function (name) {
          var event = this.create();
          event.trigger.apply(this, arguments);
      }
  };

  /**
   * 手机类型标识
   */
  var mobile = [
      'Android',
      'iPhone',
      'SymbianOS',
      'Windows Phone'
  ];
  /**
   * ipad标识
   */
  var pad = 'iPad';

  /**
   * 是否为平板
   * @param plt
   */
  function isTablet() {
      var smallest = Math.min(this.getWidth(), this.getHeight());
      var largest = Math.max(this.getWidth(), this.getHeight());
      var matchSize = (smallest > 460 && smallest < 1100) &&
          (largest > 780 && largest < 1400);
      var matchUa = this.userAgent.indexOf(pad) > -1;
      return matchSize && matchUa;
  }
  /**
  * 加载script
  * @param {String} url -- 链接
  */
  function loadScript(url) {
      return new Promise(function (resolve, reject) {
          var _head = document.getElementsByTagName('head')[0];
          var _script = document.createElement('script');
          _script.setAttribute('type', 'text/javascript');
          _script.setAttribute('src', url);
          _head.appendChild(_script);
          _script.onload = function () {
              resolve();
          };
          _script.onerror = function (err) {
              reject(err);
          };
      });
  }
  /**
   * document的ready事件监听
   * @param {Function} [callback] - 回调函数
   * @return {Promise} - 返回promise，completed后自动解绑
   * */
  function docReady(callback) {
      var promise = null; // Promise;
      if (!callback) {
          // a callback wasn't provided, so let's return a promise instead
          promise = new Promise(function (resolve) {
              callback = resolve;
          });
      }
      /* istanbul ignore else */
      if (document.readyState === 'complete' ||
          document.readyState === 'interactive') {
          callback();
      }
      else {
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

  var LISTEN = 'WAITFORBRIDGE'; // 等待 jsbridge加载的信息。。
  var MESSAGE = 'platform got ready!';
  var Platform = /** @class */ (function () {
      function Platform(props) {
          this.matchlist = []; // 计算的平台列表
          this.isPortrait = null; // 是否为竖屏的判断
          this.width = null; // 宽度
          this.height = null; // 高度
          var configs = props.configs, debug = props.debug;
          this.configs = configs;
          this.debug = debug;
          this.win = document.defaultView;
          this.userAgent = this.win ? this.win.navigator.userAgent : '';
          this._calcDim();
      }
      /**
       * 开始识别
       */
      Platform.prototype.startRecognition = function () {
          // 识别终端  手机识别到具体类型
          this.recogTerminal();
          if (this.configs) { // 存在配置项则进行具体平台识别
              return this.recogPlatform();
          }
          else { // 直接进行ready操作
              return this.ready();
          }
      };
      /**
       * 识别终端  如果是 mobile 则添加具体 类型
       */
      Platform.prototype.recogTerminal = function () {
          for (var i = 0; i < mobile.length; i++) {
              if (this.userAgent.indexOf(mobile[i]) > -1) {
                  this.matchlist.push("mobile" /* MOBILE */);
                  this.matchlist.push(mobile[i]);
              }
          }
          if (isTablet.apply(this)) {
              this.matchlist = [];
              this.matchlist.push("pad" /* PAD */);
          }
          if (this.matchlist.length === 0) {
              this.matchlist.push("pc" /* PC */);
          }
      };
      /**
      * 识别具体 app 平台
      */
      Platform.prototype.recogPlatform = function () {
          var _this = this;
          Object.keys(this.configs).forEach(function (key) {
              // 配置处理
              var config = _this.configs[key];
              var reg = config.pltReg || key;
              if (!(reg instanceof RegExp)) {
                  reg = new RegExp(reg);
              }
              reg.test(_this.userAgent) && _this.matchlist.push(key);
          });
          return this.ready();
      };
      /**
       * 加载js bridge两种方式
       */
      Platform.prototype.ready = function () {
          var _this = this;
          var key = this.matchlist[this.matchlist.length - 1];
          var config = this.configs[key] || null;
          return new Promise(function (resolve, reject) {
              if (!config) { // 不存在配置项直接报错
                  return _this.debug && reject(new Error('非第三方app'));
              }
              if (config.jsSDKUrl) { //  使用配置 url
                  // 第二种方式
                  loadScript(config.jsSDKUrl).then(function () {
                      docReady(function () {
                          if (config.loadWay) {
                              event.listen(LISTEN, function () {
                                  resolve(key);
                              });
                              config.loadWay(_this);
                          }
                          else {
                              resolve(key);
                          }
                      });
                  });
                  return false;
              }
              _this.debug && reject(new Error('缺少加载方式。。'));
          });
      };
      /**
       * 触发ready
       * @param {*} message
       */
      Platform.prototype.triggerReady = function (message) {
          if (this.debug) {
              console.log(MESSAGE);
              console.log(message);
          }
          event.trigger(LISTEN);
      };
      Platform.prototype.triggerFail = function (error) {
          this.debug && console.error(error);
      };
      /**
       * 是否为某个平台
       */
      Platform.prototype.isMatch = function (regList) {
          var res = false;
          this.matchlist.forEach(function (ele, index) {
              if (typeof regList === 'string') { // string 直接比对
                  ele.toLocaleLowerCase() === regList.toLocaleLowerCase() && (res = true);
              }
              else { // 数组 则遍历比对
                  regList.forEach(function (regx) {
                      ele.toLocaleLowerCase() === regx.toLocaleLowerCase() && (res = true);
                  });
              }
          });
          return res;
      };
      /**
       * 计算
       */
      Platform.prototype._calcDim = function () {
          if (this.isPortrait === null ||
              (this.isPortrait === false && this.win && this.win['innerWidth'] < this.win['innerHeight'])) { // 防止计算过的重复计算
              var win = this.win;
              if (win) {
                  this.width = win.screen.width;
                  this.height = win.screen.height;
                  if (this.width > 0 && this.height > 0) {
                      /* istanbul ignore next  */
                      if (this.width < this.height) {
                          this.isPortrait = true;
                      }
                      else {
                          // the device is in landscape
                          this.isPortrait = false;
                      }
                  }
              }
          }
      };
      /**
       * 获取宽度
       */
      Platform.prototype.getWidth = function () {
          return this.width;
      };
      /**
       * 获取高度
       */
      Platform.prototype.getHeight = function () {
          return this.height;
      };
      return Platform;
  }());

  return Platform;

})));
/* follow me on github! @ git+https://github.com/dinglei5959/appconfig.git */
//# sourceMappingURL=platform.umd.js.map
