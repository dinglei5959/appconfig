export default class Platform {
    private matchlist;
    private debug;
    private isPortrait;
    private win;
    private width;
    private height;
    private configs;
    private userAgent;
    constructor(props: any);
    /**
     * 开始识别
     */
    startRecognition(): Promise<{}>;
    /**
     * 识别终端  如果是 mobile 则添加具体 类型
     */
    recogTerminal(): void;
    /**
    * 识别具体 app 平台
    */
    recogPlatform(): Promise<{}>;
    /**
     * 加载js bridge两种方式
     */
    ready(): Promise<{}>;
    /**
     * 触发ready
     * @param {*} message
     */
    triggerReady(message: string): void;
    triggerFail(error: string): void;
    /**
     * 是否为某个平台
     */
    isMatch(regList: string | string[]): boolean;
    /**
     * 计算
     */
    private _calcDim;
    /**
     * 获取宽度
     */
    getWidth(): number | null;
    /**
     * 获取高度
     */
    getHeight(): number | null;
}
