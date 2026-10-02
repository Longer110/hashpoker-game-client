let KERROR_NET_CODE = {
    KErrNetConnectSuccess:200, //连接成功
    KErrNetReConnectTips:100, //底层C++重连，通知UI提示
    KErrBackground:101,
    KErrForeground:102,
    KErrForegroundMaxTimeOut:103,
    KErrNetStatusChangeNotReachable:104, //检测到手机网络连接断开了
    KErrNetStatusChangeWWAN:105, //检测到手机切换到wwan
    KErrNetStatusChangeWiFi:106, //检测到手机切换到 wifi
    KErrNone:0, //成功
    KErrNetUnConnect:-201, //连接服务器失败
    KErrNetDisConnect:-202, //连接断开
    KErrNetTimeOut:-203, //网络请求超时
    KErrNetSelfDisConnect:-204, //自己主动连接断开
    KErrNetSelfDisConnectChange:-2041, //主动断开切换socket
    KErrNetUnReconnect:-205, //不能重连，重连超过次数
    KErrNetServersDisConnect:-206, //服务器断开连接
    KErrNetSendFailedDisConnect:-207, //发送数据失败
    KErrNetRecvFailedDisConnect:-208, //接收数据失败
    KErrUnNetDisConnect:-209, //检测到没网络情况下的断开连接
    KErrNetHeartbeatTimeOut:-210,
    KErrNetSendAlreadyDisConnect:-211, // //发送数据时候已经断开了 
    KErrNetDisConAlreadyDisConnect:-212, // //断开连接时候已经断开了 
    KErrBackgroundDisConnect:-213, //切换后台断开网络
} 
let IP = "120.79.78.20";
let PORT = 11004;

let QYSocket = cc.Class({
    properties:{
        _socket: null,
        _ip: "",
        _prot: 0,
        _socketName: "",
        _connectCount:3,
        _isConnected:false,
        readyState: WebSocket.CLOSED,
        TAG: "QYSocket",
        onopen:null,
        onmessage:null,
        onclose:null,
        onerror:null,
        onWiFiStatus:null,
        onWwanStatus:null,
        onBackGround:null,
        onForeGround:null,
    },
    //为了保证反序列化能始终正确运行，ctor 不允许定义构造参数
    ctor: function (/*socketName*/) {
        //如果确实需要使用构造参数，可以通过 arguments 获取，但要记得如果这个类会被序列化，必须保证构造参数都缺省的情况下仍然能 new 出对象。
        let socketName = arguments[0];
        QYLogs.log(this.TAG, "ctor");
        this._socketName = socketName;
    },
    setCallback(onopen, onmessage, onclose, onerror){
        QYLogs.log(this.TAG, "setCallback");
        this.onopen = onopen;
        QYLogs.log(this.TAG, this.onopen);
        this.onmessage = onmessage;
        this.onclose = onclose;
        this.onerror = onerror;
    },
    initSocket:function(socketName){
        QYLogs.log(this.TAG, "init");
        this._socketName = socketName;
        this._createSocketManager()
        QYLogs.log(this.TAG, "_socket = ", this._socket);
    },
    _createSocketManager:function () {
        if (this._socket == null) {
            this._socket = qygameengine.SocketManagerPool.getInstance().getSocketManager();
        }
        this._socket.setEventCallback(this._eventCallback.bind(this))
    },
    connect:function (ip,port) {
        QYLogs.log(this.TAG, "connect");
        ip = ip?ip: IP;
        port = port ? port : PORT;
        this._ip = ip;
        this._port = port;
        QYLogs.log(this.TAG, "_ip=" + this._ip);
        QYLogs.log(this.TAG, "_port=" + this._port);
        this._socket.connect(this._socketName, this._ip, this._port)
    },
    getIP(){
        return this._ip;
    },
    getPort(){
        return this._port;
    },
    isSameAddress(ip,port){
        if (this._ip == ip && this._port == port) {
            return true;
        }else{
            return false;
        }
    },
    reConnect(){
        this._socket.reConnect(this._socketName)
    },

    disConnect:function (socketName, disType) {
        disType = disType?disType:0;
        socketName = socketName ? socketName : this._socketName;
        this.readyState = WebSocket.CLOSING
        this._socket.disConnect(socketName, disType)
        
    },


    _connectionSucceed:function() {
        QYLogs.log(this.TAG, "_connectionSucceed");
        QYLogs.log(this.TAG, this.onopen);
        if (this.onopen) {
            this.onopen({code:0})
        }
    },
    _connectionFailed: function (errorCode) {
        if(errorCode == KERROR_NET_CODE.KErrNetUnReconnect || errorCode == KERROR_NET_CODE.KErrNetSendFailedDisConnect
            || errorCode == KERROR_NET_CODE.KErrNetRecvFailedDisConnect || errorCode == KERROR_NET_CODE.KErrNetSelfDisConnect)
        {
            if (this.onclose) {
                this.onclose({ code: -1 })
            }
        }
       
    },
    _onmessage(data, mainCmd, subCmd){
        QYLogs.log(this.TAG, "_onmessage");
        if (this.onmessage) {
            this.onmessage({ code: 0, data: data, mainCmd: mainCmd, subCmd: subCmd})
        }
    },
    _engineEvent: function (errorCode) {
        if (errorCode == KERROR_NET_CODE.KErrNetStatusChangeWWAN){
            if (this.onWwanStatus) {
                this.onWwanStatus()
            }
        }
        else if (errorCode == KERROR_NET_CODE.KErrNetStatusChangeWiFi){
            if (this.onWiFiStatus) {
                this.onWiFiStatus()
            }
        } 
        else if (errorCode == KERROR_NET_CODE.KErrBackground) {
            if (this.onBackGround) {
                this.onBackGround()
            }
        } 
        else if (errorCode == KERROR_NET_CODE.KErrForeground) {
            if (this.onForeGround) {
                this.onForeGround()
            }
        }
    },
    _eventCallback:function (event) {
        let errorCode = event.getErrorCode();
        QYLogs.log(this.TAG, "errorCode = " + errorCode);
        if (errorCode == KERROR_NET_CODE.KErrNetConnectSuccess) {
            this._isConnected = true;
            this.readyState = WebSocket.OPEN
            this._connectionSucceed();
        } else if (errorCode == KERROR_NET_CODE.KErrNone){
            let mainCmd = event.getMainCommand();
            let subCmd = event.getSubCommand();
            // QYLogs.log(this.TAG, "mainCmd = " + mainCmd);
            // QYLogs.log(this.TAG, "subCmd = " + subCmd);
            let responseData = event.getUserData();
            let data = responseData.readBufferData()
            // let netVersion = responseData.getNetVersion();
            // let checkCode = responseData.getCheckCode();
            // let packetSize = responseData.getPacketSize();
            if(this._onmessage){
                this._onmessage(data, mainCmd, subCmd);
            }
        } else if (errorCode < KERROR_NET_CODE.KErrNone) {
            this._isConnected = false;
            this.readyState = WebSocket.CLOSED
            this._connectionFailed(errorCode);
        }else{
            this._engineEvent(errorCode)
        }
    },
    send(request)
    {
        // QYLogs.log(this.TAG, "send ");
        this._socket.send(this._socketName, request)
    },
    getUnUsedRequest()
    {
        return this._socket.getUnUsedRequest();
    },
    
    writeBuffer(mainCmd,subCmd,body){
        
        let requestObj = this.getUnUsedRequest();
        if (requestObj) {
            requestObj.setMainCommand(mainCmd);
            requestObj.setSubCommand(subCmd);
            requestObj.setCheckCode(0);
            requestObj.setNetVersion(1);
            requestObj.writeHead();
            if (body)
            {
                // QYLogs.log(this.TAG, "MapLogin body length = ", body.byteLength)
                requestObj.writeBufferData(body, body.byteLength);
            }
            
        }
        return requestObj;
    },

    close(){
        this.disConnect();
    },

    reset(){
        this._ip = "";
        this._port = 0;
    },
    release(){
    },
});
