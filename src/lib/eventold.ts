
/**
 * @description 
 * 改版后的订阅模式是有命名空间的 默认是放在 DEFUALTNAMESPACE下
 * 所以_listen已经变成三个 参数  key  cb  加 空间名 
 * 
 */
const DEFUALTNAMESPACE = 'default';
const namespaceCache:object = {};

const _slice = Array.prototype.slice;
const _shift = Array.prototype.shift;
const _unshift = Array.prototype.unshift;

function each(ary, fn) {
  var ret;
  for (var i = 0, l = ary.length; i < l; i++) {
    var n = ary[i];
    ret = fn.call(n, i, n);
  }
  return ret;
};

/**
 * 监听 存放订阅者的信息
 * @param key -- 
 * @param cb -- 处理函数
 * @param namecacheKey -- 命名空间 的访问key
 */
export function _listen(key:string, cb, namecacheKey:object) {
  if (!namecacheKey[key]) {
    namecacheKey[key] = [];
  }
  namecacheKey[key].push(cb);
}

/**
 * 触发事件
 */
export function _trigger () {
  const cache = Array.prototype.shift.call(arguments);
  const key = Array.prototype.unshift.call(arguments);
  const  args = arguments;
  const  scope = this;
  let stack:Array<any> = cache[key];
  if (!stack || !stack.length) {
    return;
  }
  return each(stack, function() {
    this.apply(scope, args);
  });
};



export function _remove(key, cache, fn?) {
  if (cache[key]) {
    if (fn) {
      for (var i = cache[key].length; i >= 0; i--) {
        if (cache[key][i] === fn) {
          cache[key].splice(i, 1);
        }
      }
    } else {
      cache[key] = [];
    }
  }
};

export function _create (namespace) {
    namespace = namespace || DEFUALTNAMESPACE;
    let cache = {};
    let offlineStack = []; // 离线事件
    let ret = {
      listen: function(key, fn, last) {
        _listen(key, fn, cache);

        if (offlineStack === null) {
          return;
        }
        
        //最后模式
        if (last === 'last') {
          offlineStack.length && offlineStack.pop()();
        } else {
          each(offlineStack, function() {
            this();
          });
        }

        offlineStack = null;
      },
      one: function(key, fn, last) {
        _remove(key, cache);
        this.listen(key, fn, last);
      },
      remove: function(key, fn) {
        _remove(key, cache, fn);
      },
      trigger: function() {
        var fn,
          args,
          _self = this;
        _unshift.call(arguments, cache);
        args = arguments;
        fn = function() {
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
    
};

export default {
  create: _create,
  one: function(key, fn, last) {
    var event = this.create();
    event.one(key, fn, last);
  },
  remove: function(key, fn) {
    var event = this.create();
    event.remove(key, fn);
  },
  listen: function(key, fn, last?) {
    var event = this.create();
    event.listen(key, fn, last);
  },
  trigger: function(name?:string) {
    var event = this.create();
    event.trigger.apply(this, arguments);
  }
}
