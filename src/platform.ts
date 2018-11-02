
enum Terminal {
  MOBILE = "mobile",
  PC = 'pc',
  PAD = 'pad'
}

class Platform {
  private matchlist:Array<string>; // 计算的平台列表
  private debug:boolean; // 是否设置为 调试模式  打印具体信息
  private isPortrait:boolean | null = null; // 是否为竖屏的判断
  private win:Window; // 当前 frame的window对象
  private width:number; // 宽度
  private height:number; // 高度

  constructor(props){
    const { configs , debug  } = props;
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
  private _calcDim() {
    if (  
      this.isPortrait === null ||
      (this.isPortrait === false && this.win['innerWidth'] < this.win['innerHeight'])
    ) { // 防止计算过的重复计算
      const win = this.win;
      this.width = win.screen.width;
      this.height = win.screen.height;
      if (innerWidth > 0 && innerHeight > 0) {
        /* istanbul ignore next  */
        if (innerWidth < innerHeight) {
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