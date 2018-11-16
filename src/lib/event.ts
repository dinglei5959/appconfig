const DEFAULTNAMESPACEKEY = 'default'; // 自定义默认的
const nameSpaceCache = {}; // 命名空间存储区



class NameSpace {
  private eventCahce:object = {}; // 事件缓存池  存放的是  {"click":[fn,cb,....]}
  private offLineStackEvent:Array<string> = []; // 监听某个事件前 触发的过的事件记录 ['click','change']
  private name:string|null = null;
  constructor(){

  }

  /**
   * 
   * @param key 
   * @param callback 
   * @param last -- 是否只 
   */
  listen(key:string,callback,last?:boolean):void{

    if( !this.eventCahce[<any>key] ){ // 判断是否存在 不存在则创建新的 订阅者缓存池
      this.eventCahce[key] = [];
    }

    if(last){
      
    }else{
      this.offLineStackEvent.forEach((eventName)=>{
        if(eventName){
          
        }
      });
    }

    this.eventCahce[key].push(callback);
    
  }

}

function createNameSpace(key:string):object{
  let namespace = undefined;



  return nameSpaceCache[key]?nameSpaceCache[key]:namespace;
}