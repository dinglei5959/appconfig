const DEFAULTNAMESPACEKEY = 'default'; // 自定义默认的
const nameSpaceCache = {}; // 命名空间存储区



class NameSpace {
  private eventCahce:object = {};
  constructor(){

  }

  listen(key:string,callback,last?:boolean):void{

    if( !this.eventCahce[<any>key] ){ // 判断是否存在 不存在则创建新的 订阅者缓存池
      this.eventCahce[key] = [];
    }

    this.eventCahce[key].push(callback);
    
  }

}

function createNameSpace(key:string):object{
  let namespace = undefined;



  return nameSpaceCache[key]?nameSpaceCache[key]:namespace;
}