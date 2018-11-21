

interface listen {
  isOnce:boolean;
  handler:Function;
}

export default class EventCenter {
  private eventListenerCache:object = {};
  private eventTriggerCache:object = {}; // 存放 trigger过的事件， 但是没有

  constructor(props?:object){

  }

  /**
   * 事件监听
   * @param key 
   * @param handler 
   */
  listen(key:string,handler:Function){

    this.pushEvent(key,handler);

    if(this.eventTriggerCache[key]){ // 需要先执行了，因为
      this.trigger(key);
    }
  }

  /**
   * 
   * @param key 
   */
  trigger(key:string){
    if( !this.isExistInEventCache(key) ){ // 当不存在此种类型的监听，则创建缓存的位置
      this.pushTrigger(key);
    } else { // 事件执行

      this.executeHandler(key);

    }
  }


  remove(key:string,handler:Function){
    if( this.isExistInEventCache(key) ){ // 存在则需要进行删除操作。。
      this.removeEvent(key,handler);
    }
  }

  once(key:string,handler:Function){
    this.pushEvent(key,handler,true);

    if(this.eventTriggerCache[key]){ // 需要先执行了，因为
      this.trigger(key);
    }
  }

  /**
   * 执行缓存， 如果只是 一次执行  则执行完需要删除。。。
   * @param key 
   */
  private executeHandler(key:string){
    for(let i = 0 ; i< this.eventListenerCache[key].length ; i++){
      this.eventListenerCache[key][i].handler();
      if(this.eventListenerCache[key][i].isOnce){ // 是否只执行一次。。。
        this.removeItemFromArrByIndex(this.eventListenerCache[key],i);
      }
    }
  }

  /**
   * 删除某个Event
   * @param key 
   * @param handler 
   */
  private removeEvent(key:string,handler:Function){ 
    for(let i = 0 ; i< this.eventListenerCache[key].length ; i++){
      const item:listen = this.eventListenerCache[key][i];
      if(handler === item.handler) { // 找到了监听的事件。。
        
        this.removeItemFromArrByIndex(this.eventListenerCache[key],i);
        break;
      }
    }
  }

  /**
   * 删除数组的一个值
   * @param arr 
   * @param index 
   */
  private removeItemFromArrByIndex(arr:Array<listen>,index:number){
    arr.splice(index,1);
  }

  
  private pushEvent(key:string,handler:Function,isOnce?:boolean){
    if( !this.isExistInEventCache(key) ){ // 当不存在此种类型的监听，则创建缓存的位置
      this.eventListenerCache[key] = [];
    }
    const item:listen = {
      isOnce:!!isOnce,
      handler:handler
    }
    this.eventListenerCache[key].push(item);
  }

  private pushTrigger(key:string){
    if( !this.isExistInTriggerCache(key) ) {
     this.eventTriggerCache[key] = true;
    }
  }

  private isExistInEventCache(key:string){
    return key in this.eventListenerCache;
  }

  private isExistInTriggerCache(key:string){
    return key in this.eventListenerCache;
  }

}