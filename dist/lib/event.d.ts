declare const DEFAULTNAMESPACEKEY = "default";
declare const nameSpaceCache: {};
declare class NameSpace {
    private eventCahce;
    constructor();
    listen(key: string, callback: any, last?: boolean): void;
}
declare function createNameSpace(key: string): object;
