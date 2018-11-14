# appconfig
识别各个app平台，并且注册其bridge

###example
npm install appconfig2

es5 
app = require('appconfig2');

es6
import platapp from 'appconfig2';


####configure example
```
var config = {
  wechat: {
    type: 3,
    pltReg: /wechat|micromessenger/i,
    jsSDKUrl: "//res.wx.qq.com/open/js/jweixin-1.2.0.js",
    loadWay: function(plt) {
      plt.listenJsBridgeLoad("WeixinJSBridge", "WeixinJSBridgeReady",window);
    }
  },
  alipay: {
    type: 3,
    pltReg: "Alipay",
    jsSDKUrl:"//a.alipayobjects.com/g/h5-lib/alipayjsapi/3.0.2/alipayjsapi.min.js",
    loadWay: function(plt) {
      plt.listenJsBridgeLoad("AlipayJSBridge", "AlipayJSBridgeReady",window);
    }
  }
};

```

```
import platapp from 'appconfig2';

var pltform = new platapp({configs:config,debug:true});

pltform.startRecognition().then(function(readySource){
  switch(readySource){
    case "wechat":
      console.log('doing somethings after wechat init');
    case "alipay"
      console.log('doing somethings after alipay init');
  }
})
```