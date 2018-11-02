
const DEFUALTNAMESPACE = 'default';
const namespaceCache = {};

/**
 * 监听 存放订阅者的信息
 * @param key -- 
 * @param fn -- 处理函数
 * @param cache -- 命名空间
 */
function _listen(key, fn, cache) {
  if (!cache[key]) {
    cache[key] = [];
  }
  cache[key].push(fn);
}


function _trigger () {
  const cache = Array.prototype.shift.call(arguments),
  const key = Array.prototype.unshift.call(arguments),
  const  args = arguments,
  const  scope = this,
    ret,
    stack = cache[key];
  if (!stack || !stack.length) {
    return;
  }
  return each(stack, function() {
    this.apply(scope, args);
  });
};

      _trigger,
      _remove,
      _slice = Array.prototype.slice,
      _shift = Array.prototype.shift,
      _unshift = Array.prototype.unshift,
      ,
      _create,
      find,
      each = function(ary, fn) {
        var ret;
        for (var i = 0, l = ary.length; i < l; i++) {
          var n = ary[i];
          ret = fn.call(n, i, n);
        }
        return ret;
      };
    _remove = function(key, cache, fn) {
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
    
    _create = function(namespace) {
      var namespace = namespace || DEFUALTNAMESPACE;
      var cache = {},
        offlineStack = [], // 离线事件
        ret = {
          listen: function(key, fn, last) {
            _listen(key, fn, cache);
            if (offlineStack === null) {
              return;
            }
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