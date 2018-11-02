
import Config from './lib/config';
import { mobile as PhoneTypeList , Terminal } from './lib/platform-type';
import { isTablet , loadScript , docReady } from './lib/utils';



export default  class Platform {
  private matchlist:Array<string>; // 计算的平台列表
  private debug:boolean; // 是否设置为 调试模式  打印具体信息
  private isPortrait:boolean | null = null; // 是否为竖屏的判断
  private win:Window; // 当前 frame的window对象
  private width:number; // 宽度
  private height:number; // 高度
  private configs:Array<Config>; // 配置项
  private userAgent:string; //

  constructor(props){
    const { configs , debug  } = props;

    this.configs = configs;
    this.debug = debug;
    this.win = document.defaultView;
    this.userAgent = this.win.navigator.userAgent;
    this._calcDim();

  }

  /**
   * 开始识别
   */
  startRecognition() {
    
    // 识别终端  手机识别到具体类型
    this.recogTerminal(); 

    if ( this.configs ) { // 存在配置项则进行具体平台识别
      return this.recogPlatform();
    } else { // 直接进行ready操作
      return this.ready();
    }
  }

  /**
   * 识别终端  如果是 mobile 则添加具体 类型
   */
  recogTerminal(){

    for(let i = 0 ; i< PhoneTypeList.length ; i++ ){
      if(this.userAgent.indexOf(PhoneTypeList[i])>-1){
        this.matchlist.push(Terminal.MOBILE);
        this.matchlist.push(PhoneTypeList[i]);
      }
    }

    if(isTablet.apply(this)){
      this.matchlist = [];
      this.matchlist.push(Terminal.PAD);
    }

    if(this.matchlist.length === 0){
      this.matchlist.push(Terminal.PC);
    }
    
  }

   /**
   * 识别具体 app 平台
   */
  recogPlatform() {
    Object.keys(this.configs).forEach((key) => {
      // 配置处理
      const config = this.configs[key];
      let reg:string|RegExp = config.pltReg || key;
      if (!(reg instanceof RegExp)) {
        reg = new RegExp(reg);
      }
      reg.test(this.userAgent) && this.matchlist.push(key);
    });
    return this.ready();
  }


  /**
   * 加载js bridge两种方式
   */
  ready() {
    const key:string = this.matchlist[this.matchlist.length - 1];
    const config = this.configs[key] || null;
    return new Promise((resolve, reject) => {

      if (!config) { // 不存在配置项直接报错
        return this.debug && reject(new Error('非第三方app'));
      }
      
      if (config.jsSDKUrl) { //  使用配置 url
        // 第二种方式
        loadScript(config.jsSDKUrl).then(() => {
          docReady(() => {
            if (config._listener) {
              event.listen(LISTEN, () => {
                resolve(key);
              });
              config._listener(this);
            } else {
              resolve(key);
            }
          });
        });
        return false;
      }
      this.debug &&  reject(new Error('缺少加载方式。。'));
    });
  }


  /**
   * 是否为某个平台
   */
  isMatch(regList:string|string[]):boolean {
    let res = false;
    this.matchlist.forEach((ele:string, index) => {

      if(typeof regList === 'string'){ // string 直接比对
        ele.toLocaleLowerCase() === regList.toLocaleLowerCase() && (res = true);
      } else { // 数组 则遍历比对
        regList.forEach((regx)=>{
          ele.toLocaleLowerCase() === regx.toLocaleLowerCase() && (res = true);
        });
      }
     
    });
    return res;
  }


  /**
   * 计算
   */
  private _calcDim():void {
    if (  
      this.isPortrait === null ||
      (this.isPortrait === false && this.win['innerWidth'] < this.win['innerHeight'])
    ) { // 防止计算过的重复计算
      const win:Window = this.win;
      this.width = win.screen.width;
      this.height = win.screen.height;
      if (this.width > 0 && this.height > 0) {
        /* istanbul ignore next  */
        if (this.width < this.height) {
          this.isPortrait = true;
        } else {
          // the device is in landscape
          this.isPortrait = false;
        }
      }
    }
  }

  /**
   * 获取宽度
   */
  getWidth(){
    return this.width;
  }

  /**
   * 获取高度
   */
  getHeight(){
    return this.height;
  }

}