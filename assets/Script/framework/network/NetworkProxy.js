// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-01 12:05:23
//     * @Description: 网络连接代理
// ]]

let EventManager = require("EventManager");
let NetworkEvent = require("NetworkEvent");
let NetworkManager = require("NetworkManager");
let MsgManager = require("MsgManager");
let MSG = require("Msg");
let Target = EventManager.Target;
let Event = EventManager.Event;
let HALL_CMD = require("protocol_hall");
let HALL_MSG = require("Msg_hall");
const UIFrame = require("../extension/UIFrame");

let TIMER_TIMEOUT = 10;  //(s) 超时定时器间隔
let TIMER_INTERVAL = 1; //(s) 循环定时器间隔

let OPTIONS_DEFAULT = {
    debug: true,
}
class NetworkProxy extends cc.EventTarget {
    name = "";
    _debug = true;
    _network = null;
    _servers = []; //服务器配置
    _server = null;     //记录当前连接的服务器
    _autoSwitchServer = true; //是否自动切换网关
    _countSwitch = 0; //已切换网关次数
    _idTimeout = 0;  //后台超时定时器
    _idInterval = 0; //定时器ID
    _timeout = TIMER_TIMEOUT;   //(s) 进入后台多少秒超时自动断开
    _interval = TIMER_INTERVAL; //(s) 定时器间隔
    _background = false; //是否已进入后台
    constructor(options) {
        super();
        this.name = this.constructor.name;
        if (!options || typeof options != 'object') {
            options = OPTIONS_DEFAULT;
        }
        if (typeof options.debug != 'boolean') {
            options.debug = true;
        }
        if(options.name){
            this.name = options.name;
        }
        this._debug = options.debug && !CC_EDITOR;
        this._network = new NetworkManager(this, options);
        // this._debug && cc.log(`${this.name} constructor`);
    }
    setServerList(configs) {
        if(!(configs instanceof Array)){
            cc.error("ServerBase", "无效的服务器列表. params="+configs);
            return;
        }
        this._servers = configs;
    }
    getServerList(){
        return this._servers
    }

    setEnabled(enabled){
        this._network.setEnabled(enabled);
    }
    setSocketType(type){
        if(this._network){
            this._network.setSocketType(type);
        }
    }

    setAutoSwitchServer(enabled) {
        this._autoSwitchServer = enabled;
    }
    load(){
        Target.on(Event.SHOW, this._onAppShow, this);
        Target.on(Event.HIDE, this._onAppHide, this);
    }
    destroy(){
        Target.targetOff(this);
    }
    init(server) {
        this._network.init(server);
    }
    connect(server) {
        if(!this._server){
            this._server = server;
        }
        this._network.connect(server);
    }
    reConnect(){
        if(this._server){
            this._network.connect(this._server);   
        }     
    }
    send(mainCmd, subCmd, data) {
        if (!this._network.isConnect()) {
            cc.warn("NetworkProxy", "网络未连接，协议丢弃。 mainCmd="+mainCmd+", subCmd="+subCmd);
            this.emit(NetworkEvent.UNREADY);
            return;
        }
        if (mainCmd != 1300) {
            // cc.log(`send mianCmd ${mainCmd} subCmd ${subCmd} data ${cc.js.isString(data) ? data : JSON.stringify(data)}`)
            cc.log(`send mianCmd ${mainCmd} subCmd ${subCmd}`)
            
             console.log("%c客户端请求 sendPacket", "color: white; background: dodgerblue; padding: 2px 4px; border-radius: 3px;", `send data : ` + JSON.stringify(data));

        }
        this._network.send(mainCmd, subCmd, data);
    }
    release() {
        this._network.release();
    }
    disConnect(force) {
        // cc.warn("TODO", "disConnect");
        this._network.close(force);
    }
    isConnect(server) {
        return this._network.isConnect(server);
    }
    getServer(){
        return this._network.getServer();
    }
    onHeartbeat(delay) {
        // this._debug && cc.log(this.name, "onHeartbeat: delay=" + delay + "(ms)");
    }
    onTimeout() {
        this._debug && cc.log(this.name, "onTimeout");
        this.emit(NetworkEvent.TIMEOUT);
    }
    onFail() {
        this._debug && cc.log(this.name, "onFail");
        //自动切换网关
        let index = this._switchServerIndex();
        if(index<0){
            this.emit(NetworkEvent.FAIL);
            return;
        }
        else{
            let server = this._servers[index];
            this._debug && cc.warn(this.name, "自动切换网关. server="+server.HOST+":"+server.PORT);
            this.connect(server);
        }
    }
    onReConnect(event){
        this._debug && cc.log(this.name, "onReConnect");
        this.emit(NetworkEvent.RECONNECT, event);
    }
    onConnecting(event) {
        this._debug && cc.log(this.name, "onConnecting");
        this.emit(NetworkEvent.CONNECTING, event);
    }
    onOpen(event) {
        this._debug && cc.log(this.name, "onOpen");
        let server = this.getServer();
        this._server = server;
        this._countSwitch = 0;
        this.emit(NetworkEvent.OPEN, server);
        // MsgManager.fire(MSG.WEBSOCKET.OPEN);
    }
    onConnected(event){
        this._debug && cc.log(this.name, "onConnected");
        this.emit(NetworkEvent.CONNECTED, event);
    }
    onClose(event) {
        this._debug && cc.log(this.name, "onClose: event=" + event);
        this.emit(NetworkEvent.CLOSE, event);
        // MsgManager.fire(MSG.WEBSOCKET.CLOSE);
    }
    onError(event) {
        this._debug && cc.log(this.name, "onError: event=" + event);
    }
    onMessage(packet) {
        this._debug && cc.log(this.name, "onMessage: data=", packet);
        if (packet.msg) {
             console.log("%c服务器回复 onMessage: data=", "color: white; background: orange; padding: 2px 4px; border-radius: 3px;", JSON.stringify(packet) );
            if (packet.msg == HALL_CMD.Main_CMD.AccountPayInfoRsp_CMD) {
                UIFrame.showTips("充值成功到账");
            }
            MsgManager.fire(packet.msg, packet.data);
        }

    }
    //切换网关服
    _switchServerIndex() {
        //登录界面不自动切换
        if (!this._autoSwitchServer) {
            return -1;
        }
        let array = this._servers;
        let originalIndex = 0;
        let server = this._server;
        for (let index = 0; index < array.length; index++) {
            const item = array[index];
            if (item.HOST == server.HOST && item.PORT == server.PORT) {
                originalIndex = index;
                break;
            }
        }

        if (this._countSwitch < array.length - 1) {
            this._countSwitch++;
            let curIndex = originalIndex + this._countSwitch;
            curIndex = curIndex % array.length;
            return curIndex;
        }
        
        return -1;
    }
    _onAppShow(){
        if(!this._background) return;
        this._background = false;

        this._debug && cc.log(this.name, "_onAppShow");
        this._stopTimeout();
        //网络启用时才重连
        if(this._network.getEnabled()){
            this.reConnect();
        }
    }
    _onAppHide(){
        if(this._background) return;
        this._background = true;
        
        this._debug && cc.log(this.name, "_onAppHide");
        this._startTimeout();
    }
    _startTimeout(){
        this._stopTimeout();
        this._idTimeout = setTimeout(() => {
            this._onTimeout();
            this._stopTimeout();
        }, 1000*this._timeout);
    }
    _stopTimeout(){
        if(this._idTimeout){
            clearTimeout(this._idTimeout);
        }
        this._idTimeout = 0;
    }
    _onTimeout(){
        this._debug && cc.log(this.name, "_onTimeout");
        let force = true;
        this._network.close(force);
    }
    _startInterval(){
        this._stopInterval();
        this._idInterval = setInterval(() => {
            this._onInterval();
        }, 1000*this._interval);
    }
    _stopInterval(){
        if(this._idInterval){
            clearInterval(this._idInterval);
        }
        this._idInterval = 0;
    }
    _onInterval(){
    }
}

module.exports = NetworkProxy;