// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 网络管理
// ]]

let NetworkPacker = require("NetworkPacker");
let QYSocket = require("QYSocket");

let socketid = 0;

const HEARTBEAT_INTERVAL = 10; //心跳包间隔 单位(s)
const TIMEOUT_COUNT_MAX = 1;  //心跳超时最大次数
const RECONNECT_COUNT_MAX = 3; //重连最大次数
const USE_DECODEIO_PROTOBUF = true; //数据包是否使用 decodeIO_protobuf 格式
const USE_CRYPTO = false;

// let logger = console.log.bind(console);
// let logger = console.warn.bind(console);

class NetworkManager{
    name = "NetworkManager";
    _debug = true && !CC_EDITOR;

    _socket = null;
    _proxy = null;  //网络连接事件代理
    _packer = null; //协议数据封包/解包

    _server = null;  //当前连接服务器
    _options = null; //当前连接附加选项
    _interval = HEARTBEAT_INTERVAL;     //心跳包间隔 单位(s)
    _socketid = 0;
    _force = false;     //是否强制关闭
    _heartbeatid = 0;   //心跳定时器id
    _reconnectid = 0;   //重连定时器id
    _reCreateID = 0;    //重新创建连接定时器id
    _reCreateTimestamp = 0; //重新创建时间戳
    _needReCreate = false; //创建连接超时没成功时，是否重新创建
    _timestamp = 0;     //心跳时间戳
    _count_timeout = 0;     //心跳超时次数
    _count_reconnect = 0;   //重连次数
    _enabled = true;    //网络是否启用
    _mapTimestamps = {}; //每条socket连接时间戳
    _isReConnect = true; //是否支持重连
    _pendingPackets = []; //未就绪时暂存待发送的封包

    get _readyState() {
        if (this._socket) {
            return this._socket.readyState;
        }
        return WebSocket.CLOSED;
    }
    get _isconnect() {
        let flag = this._socket && (this._readyState == WebSocket.OPEN);
        return flag;
    }

    constructor(proxy, options) {
        this._proxy = proxy;
        this._server = null;
        this.name = proxy && `${this.name}<${proxy.name}>`;

        options = options || {};
        if (typeof options.use_decodeIO_protobuf != 'boolean') {
            options.use_decodeIO_protobuf = USE_DECODEIO_PROTOBUF;
        }
        if (typeof options.useCrypto != 'boolean') {
            options.useCrypto = USE_CRYPTO;
        }
    
        if(options.isReConnect != null){
            this._isReConnect = options.isReConnect
        }else{
            this._isReConnect = true
        }
        // if(app.config.IS_SOCKET){
        //     options.isNative = cc.sys.isNative
        // }else{
        //     options.isNative = false
        // }

        this._options = options;
        this._needReCreate = !!options.needReCreate;
        this._packer = new NetworkPacker(this, options);

        // this._debug && console.log(`${this.name} constructor`);
    }
    getEnabled(){
        return this._enabled;
    }
    setEnabled(value) {
        this._enabled = value;
    }
    setSocketType(type){
        if(type == 1){ //原生socket
            this._options.isNative = true
        }else{//websocket
            this._options.isNative = false
        }
        if(this._packer){
            this._packer.setSocketType(type)
        }
    }

    init(server) {
        this._server = server;
        socketid++;
        this._socketid = socketid;
    }


    checkTelegramMiniApp(){
        if(app.config.ISTelegramMiniApp){
            return true
        }
        let isTelegramMiniApp = (typeof window.Telegram !== 'undefined' && !!window.Telegram.WebApp);
        const tg = window.Telegram?.WebApp;
        const p = tg?.platform;
        const validPlatforms = ['android', 'ios', 'tdesktop', 'web', 'weba' ,'macos'];
        if (isTelegramMiniApp && validPlatforms.includes(p)) {
            return true
        }
        return false
    }
    connect(server) {

        console.log( "链接网络 ： " +  this.getEnabled() + " , server : " + JSON.stringify(server));
        //不启用网络
        if(!this.getEnabled()){
            return;
        }

        // if (!server || typeof server != 'object') {
        //     cc.error(`${this.name} invalid server! type=${typeof server}`);
        //     this._onFail();
        //     return;
        // }

        if(this._readyState==WebSocket.CONNECTING || this._readyState==WebSocket.OPEN){ //如果本来就是连接状态
            let same = this._checkTheSameServer(server);
            if(same){
                if(this._readyState==WebSocket.OPEN){
                    this._onConnected(null);
                }
                return; //多次连接同一个服务器，忽略本次连接
            }
            else{
                this.release(); //不同的服务器，释放旧连接
            }
        }
        console.log(this.name, "连接日志： 开始连接");
        console.log(this._proxy&&this._proxy.name + "：server = " + JSON.stringify(server, null, 4));

        // 保存新服务器，重连时使用
        this.init(server);
		
		//主动连接，重置强制关闭标志
        this._force = false;
        this._pendingPackets = [];

        // 构造 URL：当 PORT 为空/null/undefined，或 wss:443 / ws:80 时，省略端口
        let numPort = Number(server.PORT);
        let needPort = true;
        if (!server.PORT || server.PORT == null || server.PORT === "") {
            needPort = false;
        } else if (isNaN(numPort)) {
            needPort = false;
        } else if (server.HEAD == "wss" && numPort === 443) {
            needPort = false;
        } else if (server.HEAD == "ws" && numPort === 80) {
            needPort = false;
        }
        let url = needPort
            ? `${server.HEAD}://${server.HOST}:${server.PORT}`
            : `${server.HEAD}://${server.HOST}`;
        console.log("连接日志： ", url);
        let socket = null;
        let options = this._options;
        if(options.isNative){
            //TODO
            // socket = new WebSocket(url, [], "chessSetVersion/center.cer");
            // socket.binaryType = options.binaryType || "arraybuffer";
            console.warn(`${this.name} connect: 使用 QYSocket 连接`);
            socket = new QYSocket();
            socket.initSocket(this.name);
            // this._socket.onWwanStatus = this.netStatusChangeWWAN.bind(this)
            // this._socket.onWiFiStatus = this.netStatusChangeWiFi.bind(this)
            socket.connect(server.HOST, server.PORT)
            console.log("TODO", "native: NetworkManager.connect");
        }
        else{
            if(this.checkTelegramMiniApp()){
                let tgHost = "game-api.hashpoker.vip";
                let tgPort = Number(server.PORT);
                // 与上面同样的规则：PORT 为空/NaN / 443 时，省略端口
                let tgNeedPort = true;
                if (!server.PORT || server.PORT == null || server.PORT === "") {
                    tgNeedPort = false;
                } else if (isNaN(tgPort)) {
                    tgNeedPort = false;
                } else if (tgPort === 443) {
                    tgNeedPort = false;
                }
                url = tgNeedPort
                    ? "wss://" + tgHost + ":" + tgPort
                    : "wss://" + tgHost;
            }
            console.warn(`${this.name} connect: 使用 WebSocket 连接： ` + url);
            socket = new WebSocket(url);
            socket.binaryType = options.binaryType || "arraybuffer";
        }
        if(this._socket){
            this._bindEvent(this._socket, true);
        }
        this._socket = socket;
        this._bindEvent(socket, false);
        this._onConnecting(null);
        this._mapTimestamps[this._socketid] = {
            socketid: this._socketid,
            timestamp: Date.now(),
        }

        //当一定时间内WebSocket仍未创建成功时
        if(this._needReCreate){
            this._timeoutReCreate(server);
        }
    }

    _timeoutReCreate(config){
        if(!this._reCreateTimestamp){
            this._reCreateTimestamp = Date.now();
        }

        let t = Date.now();
        //一分钟
        if((t-this._reCreateTimestamp) > 1000 * 60){
            return;
        }

        // this._onReConnect(null);
        let server = config
        let delay = 3; //3秒仍未创建成功时，超时重新创建
        if(this._reCreateID){
            clearTimeout(this._reCreateID);
        }
        this._reCreateID = setTimeout(() => {
            console.log(this.name, "连接日志： 重新创建");
            console.warn(`[ERROR] ${this.name} timeoutReCreate [${this._socketid}]，连接超时未返回，释放旧连接重新创建。`);
            this._reCreateID = 0;
            //切换到了后台，继续定时判断
            if(this._proxy._background){
                this._reCreateTimestamp = 0;
                this._timeoutReCreate(server);
            }
            else{
                let temp = this._reCreateTimestamp;
                this.release();
                this._reCreateTimestamp = temp;
                this.connect(server);
            }
        }, delay*1000);
    }

    send(mainCmd, subCmd, data){
        let packet = this._packMessage(mainCmd, subCmd, data);
        if(!this._isconnect){
            if(this._readyState === WebSocket.CONNECTING){
                this._pendingPackets.push(packet);
                this._debug && console.log(`${this.name} socket send [${this._socketid}]: queued (CONNECTING), queue=${this._pendingPackets.length}`);
            }else{
                this._debug && console.log(`${this.name} socket send [${this._socketid}]: unconnect, dropped`);
            }
            return;
        }
        this._sendPacket(packet);
    }

    close(force) {
        this._force = !!force;
        this._stopHeartbeat();
        this._pendingPackets = [];
        console.warn(this.name, "连接日志： 连接关闭");
        console.log(`${this.name} close socket [${this._socketid}]: to close`, this._force, this._isconnect, this._readyState);
        if (this._socket) {
            if (this._isconnect && this._readyState!=WebSocket.CLOSING) {
                console.log(`${this.name} close socket [${this._socketid}]: closing`);
                this._socket.close(1000, "[user manual]");
            }
            //正在连接
            else if(this._readyState!=WebSocket.CONNECTING){
                //清除回调
                this._bindEvent(this._socket, true);
            }
            else {//已经处于未连接状态
                // this._debug&&console.log(`${this.name} closed socket [${this._socketid}]: closed`);
            }
        }
    }

    release() {
        if (!this._socket) return;

        let force = true;
        console.log("释放连接", this._socketid);
        this.close(force);
        if(force){
            //主动触发一次回调，避免socket事件clear后无法监听到网络关闭消息
            this._proxy && this._proxy.onClose();
        }
        this._reset();
    }
    _reset(){
        this._clear();
        if(this._reconnectid){
            clearTimeout(this._reconnectid);
        }
        if(this._reCreateID){
            clearTimeout(this._reCreateID);
            this._reCreateID = 0;
        }

        this._reCreateTimestamp = 0;
        this._count_reconnect = 0;
        this._reconnectid = 0;
        this._server = null;
        this._force = false;

        let options = this._options;
        if(options.isNative){
            if(this._socket){
                this._socket.reset();
            }
        }
    }
    _clear() {
        console.log("清理连接", this._socketid);
        this._bindEvent(this._socket, true);
        this._stopHeartbeat();

        if(this._socket){
            delete this._socket
            this._socket = null
        }

        this._socketid = 0;
        //this._socket = null;

    }
    
    isConnect(server){
        let isConnected = this._isconnect;
        if(isConnected && server){
            isConnected = this._checkTheSameServer(server);
        }
        return isConnected;
    }
    getServer(){
        return this._server;
    }
    _checkTheSameServer(server){
        if(!this._server){
            console.warn(`${this.name} _checkTheSameServer: 当前服务器配置为空`);
            return false;
        }

        if(!server){
            console.warn(`${this.name} _checkTheSameServer: 目标服务器参数为空，使用当前服务器`);
            server = this._server;
        }
        let same = (server.HEAD==this._server.HEAD
            &&server.HOST==this._server.HOST
            &&server.PORT==this._server.PORT);
        
        return same;
    }
    
    _reConnect() {
        if(!this._server || this._isconnect){
            return;
        }

        this._force = false;
        this._count_reconnect++;
        console.log(`${this.name} socket [${this._socketid}]: reconnect count=${this._count_reconnect}`);
        //清空旧连接
        this._clear();
        if(!app.config.ISSTAG && this._count_reconnect>=RECONNECT_COUNT_MAX){//非版署时超出重连次数重连失败
            console.log(`${this.name} socket [${this._socketid}]: reconnect count max`);
            this._count_reconnect = 0;
            //多次连接失败
            this._onFail();
            return;
        }

        if (!app.config.ISSTAG) {
            this._reConnectCallBack();
        }else {
            setTimeout(() => {
                this._reConnectCallBack();
            }, 3);
        }
    }

    //重连回调
    _reConnectCallBack() {
        let delay = Math.pow(2, this._count_reconnect-1);
        
        if(this._reconnectid){
            clearTimeout(this._reconnectid);
        }
        this._onReConnect(null);
        this._reconnectid = setTimeout(() => {
            //重新连接
            this.connect(this._server, this._options);
            this._reconnectid = 0;
        }, delay*1000);
    }

    _sendPacket(packet){
        if(this._isconnect){
            // console.log(`客户端请求 sendPacket`, JSON.stringify(packet));
            this._socket.send(packet);
        }
        else{
            this._debug && console.log(`${this.name} socket [${this._socketid}]: sendPacket unconnect`);
        }
    }

    //消息封包
    _packMessage(mainCmd, subCmd, data) {
        let packet = this._packer.packData(mainCmd, subCmd, data);
        return packet;
    }

    /**
     * //消息解包
     * data = {
     *  mainCmd,
     *  subCmd,
     *  msg,
     * }
     */
    _unpackMessage(event) {
        let data = this._packer.unpackData(event);
        return data;
    }

    //启动心跳定时器
    _startHeartbeat() {
        this._stopHeartbeat();
        this._heartbeatid = setInterval(() => {
            if (this._timestamp != 0) {
                this._count_timeout++;
                console.log(`${this.name} timeout socket [${this._socketid}]: count=${this._count_timeout}`);
                //心跳超时达到一定次数，主动断开连接，close 响应事件中会重连
                if (this._count_timeout >= TIMEOUT_COUNT_MAX) {
                    this._stopHeartbeat();
                    this._onTimeout();
                    // this.close();
                    let server = this._server;
                    this.release();

                    //已切到后台，心跳超时不重连
                    if(this._proxy._background){
                    }
                    else{
                        this._timeoutReConnect(server)
                    }
                    //this.connect(server);
                    return;
                }
            }

            let packet = this._packer.packHeartbeat();
            this._ping(packet);
        }, this._interval * 1000);

        let packet = this._packer.packHeartbeat();
        this._ping(packet);
    }

    _timeoutReConnect(config){
        console.log(`${this.name} timeoutReConnect [${this._socketid}]: count=${this._count_timeout}`);
        this._onReConnect(null);
        let server = config
        let delay = 0.5;
        if(this._reconnectid){
            clearTimeout(this._reconnectid);
        }
        this._reconnectid = setTimeout(() => {
            this.connect(server);
        }, delay*1000);

    }


    _stopHeartbeat() {
        if (this._heartbeatid) {
            clearInterval(this._heartbeatid);
        }
        this._heartbeatid = 0;
        this._count_timeout = 0;
        this._timestamp = 0;
    }
    //发送心跳包
    _ping(packet) {
        this._timestamp = Date.now();
        this._sendPacket(packet);

        
    }
    //心跳包响应，数据重置
    _pong() {
        this._timestamp = 0;
        this._count_timeout = 0;
    }

    _bindEvent(socket, clear) {
        if(!socket){
            return;
        }

        let id = this._socketid;
        socket.onopen = function (event) {
            let info = this._mapTimestamps[id];
            if(info){
                let t = Date.now();
                let d = t - info.timestamp;
                let msg = `网络连接成功耗时: ${d} ms`
                if(d>1000*2){
                    console.log(this.name, "[WARN] " + msg);
                }
                else{
                    console.log(this.name, msg);
                }
                delete this._mapTimestamps[id];
            }
            
            if (clear) {
                console.log(`${this.name} release socket [${id}]: onopen`);
                socket.close(1000, "[user manual release]");
                return;
            }
            this._onOpen(event);
        }.bind(this);
        socket.onclose = function (event) {
            if(this._mapTimestamps[id]){
                delete this._mapTimestamps[id];
            }
            
            if (clear) {
                console.log(`${this.name} release socket [${id}]: onclose`);
                return;
            }
            console.log("网络中断")
            this._onClose(event);
        }.bind(this);
        socket.onerror = function (event) {
            if (clear) {
                console.log(`${this.name} release socket [${id}]: onerror`);
                return;
            }
            this._onError(event);
        }.bind(this);
        socket.onmessage = function (event) {
            if (clear) {
                this._debug && console.log(`${this.name} release socket [${id}]: onmessage`);
                return;
            }
            this._onMessage(event);
        }.bind(this);
    }
    _onConnecting(event) {
        console.log(`${this.name} socket [${this._socketid}] _onConnecting`);
        this._proxy && this._proxy.onConnecting(event);
    }
    _onConnected(event){
        console.log(`${this.name} socket [${this._socketid}] _onConnected`);
        this._proxy && this._proxy.onConnected(event);
    }
    _onReConnect(event){
        //可能是网络状态管理出错了
        if(this._isconnect){
            return;
        }

        console.log(`${this.name} socket [${this._socketid}] _onReConnect`);
        this._proxy && this._proxy.onReConnect(null);
    }

    _onOpen(event) {
        console.log(this.name, "连接日志： 连接成功");
        console.log(`${this.name} socket [${this._socketid}] _onOpen`);
        // this._proxy && this._proxy.onConnecting(event);

        this._reCreateTimestamp = 0;
        if(this._reCreateID){
            clearTimeout(this._reCreateID);
            this._reCreateID = 0;
        }

        this._count_reconnect = 0;
        this._onInit(event);
    }

    _flushPendingPackets(){
        if(!this._pendingPackets || this._pendingPackets.length === 0) return;
        const queue = this._pendingPackets;
        this._pendingPackets = [];
        this._debug && console.log(`${this.name} socket [${this._socketid}] _flushPendingPackets: count=${queue.length}`);
        for(let i=0; i<queue.length; i++){
            if(this._isconnect){
                this._sendPacket(queue[i]);
            }else{
                this._pendingPackets.push(queue[i]);
            }
        }
    }

    _onInit(event) {
        console.log(`${this.name} socket [${this._socketid}] _onInit`);
        this._proxy && this._proxy.onOpen(event);
        //启动心跳定时器
        this._startHeartbeat();
        this._flushPendingPackets();
    }

    _onClose(event) {
        if(this._reCreateID){
            clearTimeout(this._reCreateID);
            this._reCreateID = 0;
        }

        console.log(`${this.name} socket [${this._socketid}] _onClose`, this._force);
        this._proxy && this._proxy.onClose(event);
        this._stopHeartbeat();
        

        //不是强制关闭的，重新连接
        if(!this._force && this._isReConnect){
            //不在后台才重连
            if(!this._proxy._background){
                this._reConnect();
            }
        }
        
    }

    _onError(event) {
        if(this._reCreateID){
            clearTimeout(this._reCreateID);
            this._reCreateID = 0;
        }
        console.log(`${this.name} socket [${this._socketid}] _onError`);
        this._proxy && this._proxy.onError(event);
    }

    _onMessage(event) {
        // console.log(`${this.name} socket [${this._socketid}] _onMessage`);
        let packet = this._unpackMessage(event);
        if(this._packer.isHeartBeat(packet)){
            this._onHeartbeat(packet);
            return;
        }
        this._proxy && this._proxy.onMessage(packet);
    }
    _onTimeout(){
        console.log(`${this.name} socket [${this._socketid}]: heartbeat timeout`);
        this._proxy && this._proxy.onTimeout();
    }
    _onFail(){
        console.log(`${this.name} socket [${this._socketid}]: connect fail`);
        this._proxy && this._proxy.onFail();
    }

    //服务器心跳包回调
    _onHeartbeat(data){
        this._debug && console.log(`${this.name} socket [${this._socketid}] onHeartbeat`);
        let delay = 0;
        if(this._timestamp!=0){
            delay = Date.now() - this._timestamp;
        }
        this._proxy && this._proxy.onHeartbeat(delay);
        this._pong();
    }
}

module.exports = NetworkManager;
