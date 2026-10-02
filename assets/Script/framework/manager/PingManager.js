// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: ping管理类
// ]]

let TIMER_INTERVAL = 60 * 2; //(s) 循环定时器间隔
let RE_TIMER_INTERVAL = 1;   //(s) 循环定时器间隔
let CMD = require('protocol');
let Msg = require('Msg');
let NetworkPing = require("NetworkPing");
let UserInfo = require("UserInfo");
let MsgManager = require("MsgManager");
let MSG = require("Msg");
let sendMessageCount = 3;
let maxTime = 99999

let DEFAULT_INIT_TIMER = 1000; //(ms) 初始化时间

class PingManager {

    constructor(){
        this._idPingInterval = 0;
        this._idReInterval = 0;
        this._idInterval = 0;
        this.pingNets = [];
        this._pingInfos = [];
        this._pingNetOpenMap = new Map();
        this._pingMessageMap = new Map();

    }


    getPingNets(){
        return this.pingNets;
    }

    init(){
        
        if(app.config.IS_CLUB_ONLY){
            return
        }
        
         //console.log("PingManager:init")
        this.reset();
        if(app.net){
            this._idInterval = setInterval(() => {
                if(this._idInterval){
                    clearInterval(this._idInterval);
                    this._idInterval = 0
                }
                this.reConnect();
                this._startPingInterval();
            }, DEFAULT_INIT_TIMER);
        }
    }

    initNets(){
        if(app.net){
            let servers = app.net.getServerList();
            for(let i=0;i<servers.length;i++){
                let server = servers[i];
                let pingNet = new NetworkPing({name: "NetworkPing",isReConnect:false});
                pingNet.setServerList([server])
                pingNet.setServer(server);
                pingNet.setAutoSwitchServer(false);
                this.pingNets.push(pingNet)
            }
        }
    }

    //重置
    reset(){
         //console.log("PingManager:reset")
        if(this._pingNetOpenMap){
            this._pingNetOpenMap.clear();
        }
        if(this._pingMessageMap){
            this._pingMessageMap.clear();
        }
        if(this._idInterval){
            clearInterval(this._idInterval);
            this._idInterval = 0
        }
        if(this._idReInterval){
            clearInterval(this._idReInterval);
            this._idReInterval = 0
        }
        
        let pings = []
        pings = pings.concat(this.pingNets)
        for(let i=0;i<pings.length;i++){
            let pingNet = pings[i]
            if(pingNet){
                pingNet.off(my.NetworkEvent.OPEN);
                pingNet.off(my.NetworkEvent.CLOSE);
                pingNet.off(Msg.QYLOG_UPLOAD.LineCheckRsp_CMD);
                pingNet.release();
            }
        }

        this.pingNets.length = 0;
        this.initNets();
        
        
    }

    _addPingMessage(server,time){

        if(server){
            let url = `${server.HEAD}://${server.HOST}:${server.PORT}`;
            if(!this._pingMessageMap.has(url)){
                this._pingMessageMap.set(url,[time])
            }else{
                let messageArr = this._pingMessageMap.get(url)
                messageArr.push(time)
                this._pingMessageMap.set(url,messageArr)
            }
            //计算平均时间
            if(this._pingMessageMap.has(url)){
                let arr = this._pingMessageMap.get(url)
                if(arr.length >= sendMessageCount){
                    let timeCount = 0;
                    let count = arr.length;
                    for(let i=0;i<count;i++){
                        timeCount+=arr[i]
                    }
                    this.updatePingTime(server,(timeCount/count));
                }
            }
        }
    }

    //重连获取ping信息
    reConnect(){

        this.reset();

        let pings = []
        pings = pings.concat(this.pingNets)

        for(let i=0;i<pings.length;i++){
            let pingNet = pings[i]
            if(pingNet){
                let server = pingNet.getServer();
                pingNet.on(my.NetworkEvent.OPEN, ()=>{
                    let url = `${server.HEAD}://${server.HOST}:${server.PORT}`;
                    cc.log("链接成功:"+url)
                    this.ping(pingNet)
                    this._pingNetOpenMap.set(url,true)
                });
                pingNet.on(my.NetworkEvent.CLOSE,()=>{
                    let url = `${server.HEAD}://${server.HOST}:${server.PORT}`;
                    cc.log("链接关闭:"+url)

                    if(!this._pingNetOpenMap.has(url)){
                        for(let i=0;i<sendMessageCount;i++){
                            this._addPingMessage(server,maxTime);
                        }
                    }else{
                        if(!this._pingMessageMap.has(url)){
                            for(let i=0;i<sendMessageCount;i++){
                                this._addPingMessage(server,maxTime);
                            }
                        }else{
                            let messageArr = this._pingMessageMap.get(url)
                            for(let i=messageArr.length;i<sendMessageCount;i++){
                                this._addPingMessage(server,maxTime);
                            }
                        }
                    }
                });
                pingNet.on(Msg.QYLOG_UPLOAD.LineCheckRsp_CMD,(data)=>{
                    let url = `${server.HEAD}://${server.HOST}:${server.PORT}`;
                    cc.log("消息:"+url)
                    if(data.nType == 1){
                        this.pong(pingNet,data)
                    }
                    if(data.nType == 2){
                        pingNet.release();
                    }
                });
            }
        }
        
        this._idReInterval = setInterval(() => {
            if(pings.length > 0){
                let pingNet = pings.shift();
                if(pingNet){
                    pingNet.reConnect();
                }
            }
            if(pings.length <= 0){
                if(this._idReInterval){
                    clearInterval(this._idReInterval);
                    this._idReInterval = 0
                }
            }
        }, 1000*RE_TIMER_INTERVAL);
    }

    //发送ping消息
    ping(net){

        if(net && net.getServer()){
            for(let i= 0;i<sendMessageCount;i++){
                let data = {
                    nType:1,
                    nSendTime: Date.now(),
                    nUserId:UserInfo.getInfo().nUserID,
                    arrLineInfo:[],
                }
                net.send(CMD.QYLOG_UPLOAD_MAIN_CMD.value, CMD.QYLOG_UPLOAD_MAIN_CMD.LineCheckReq_CMD, data);
            }
        }
    }
    //接收ping消息
    pong(net,data){

        if(data && data.nSendTime){
            let time = Math.floor(Date.now() - data.nSendTime)
            let url = `${net.getServer().HEAD}://${net.getServer().HOST}:${net.getServer().PORT}`;
            cc.log("线路 " + url + " 当前耗时 "+ time + " ms")
            this._addPingMessage(net.getServer(),time);
            if(this._pingMessageMap.has(url)){
                if(this._pingMessageMap.get(url).length >= sendMessageCount){
                    this.pinginfo(net)
                }
            }
        }
    }
    //更新ping消息
    updatePingTime(server,time){
        if(server){
            app.net.updateServerConfigTime(server,time/4)

            MsgManager.fire(MSG.PING.PING_TIME_SERVER,{
                server:server,
                time:time/4,
            });

            let url = `${server.HEAD}://${server.HOST}:${server.PORT}`;
            cc.log("线路 " + url + " 平均耗时 "+ time/4 + " ms")
            this._pingInfos.push({
                nTimeDiffer:time/4,
                sLineName:url,
            });
        }
    }
    //更新ping消息到服务器
    pinginfo(net){

        if(net && net.getServer()){
            let infos = []
            infos = infos.concat(this._pingInfos)
            let data = {
                nType:2,
                nUserId:UserInfo.getInfo().nUserID,
                arrLineInfo:infos,
            }
            net.send(CMD.QYLOG_UPLOAD_MAIN_CMD.value, CMD.QYLOG_UPLOAD_MAIN_CMD.LineCheckReq_CMD, data);
            this._pingInfos = [];
        }
    }
    //定时链接ping
    _onPingInterval(){
        this.reConnect();
    }
    _startPingInterval(){
        this._stopPingInterval();
        this._idPingInterval = setInterval(() => {
            this._onPingInterval();
        }, 1000*TIMER_INTERVAL);
    }
    _stopPingInterval(){
        if(this._idPingInterval){
            clearInterval(this._idPingInterval);
        }
        this._idPingInterval = 0;
    }
}

PingManager.default = new PingManager(null);
module.exports = PingManager;
