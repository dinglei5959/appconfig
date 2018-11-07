import Platform from '../platform';

export default interface Config {
  type:number;
  pltReg:string | RegExp;
  jsSDKUrl:string;
  loadWay(plt:Platform):void;
}