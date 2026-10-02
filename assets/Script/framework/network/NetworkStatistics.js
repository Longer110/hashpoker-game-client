// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-01 12:05:23
//     * @Description: 游戏网络数据统计对象
// ]]

let NetworkProxy = require("NetworkProxy");
let CMD = require('protocol');

let TIMER_INTERVAL = 1; //(s) 循环定时器间隔
let dataArray = [];
class NetworkStatistics extends NetworkProxy {
    _interval = TIMER_INTERVAL;
    _times = 0;
    _lastLevel = -1;
    constructor(options) {
        super(options);
        this.name = "NetworkStatistics";
        // this._debug && cc.log(`${this.name} constructor`);
    }
    isEnableStatistics(){
        if(window.app&&window.app.config){
            if(!app.config.ENABLE_STATISTICS){
                return false;
            }
        }
        return true;
    }
    connect(server) {
        if(!this.isEnableStatistics()){
            return;
        }
        super.connect(server);
    }
    reConnect(){
        if(!this.isEnableStatistics()){
            return;
        }
        super.reConnect();   
    }
    send(mainCmd, subCmd, data) {
        if(!this.isEnableStatistics()){
            return;
        }
        super.send(mainCmd, subCmd, data);
    }
    onOpen(event) {
        super.onOpen(event);
        this._startInterval();
    }
    onClose(event) {
        super.onClose(event);
        this._stopInterval();
    }
    statistics(data) {
        cc.errorID(1400, `App`+`.BuriedPoint`+`.statistics`, `app.statis.upload`);

        this.upload(data);
    }
    upload(data){
        if(!this.isEnableStatistics()){
            return;
        }
        
        cc.log(this.name, "upload");
        if(!CC_BUILD){
            return;
        }

        let date = new Date();
        let time = date.getTime();
        data.ldTime = time;
        let str = JSON.stringify(data);
        dataArray.push(str)
    }
    _uploadSend() {
        if (!this.isConnect()) {
            return;
        }
        if (dataArray.length > 0) {
            let str = dataArray.shift();
            this.send(CMD.MDM_GP_STATISTICS.value, CMD.MDM_GP_STATISTICS.SUB_Bur_UserInfoReq_CMD, {
                tBuildUserData: str
            });
            // cc.log(this.name, "str=" + str);
        }
    }
    _onInterval(){
        this._uploadSend();
    }

    //网络时延统计
    upLoadNetworkLatency(usrerID){
        let latency = app.getLatency();
        //时延等级
        let level = 0;
        if(latency >= 200 && latency < 400){
            level = 1;
            //累计次数
            this._times++;
        }
        if(latency >= 400 && latency < 600){
            level = 2;
        }
        if(latency >= 600 && latency < 800){
            level = 3;
        }
        if(latency >= 800){
            level = 4;
        }

        //如果网络时延不超过200ms，则不上传埋点数据
        if(level < 1){
            //重置本地记录
            this._times = 0;
            this._lastLevel = -1;
            return ;
        }
        
        //200ms到400ms区间内且累计10次以下不上传；大于400ms的区间变化时才上传
        if((this._lastLevel == 1 && this._times < 10) || (this._lastLevel != 1 && this._lastLevel == level)){
            return;
        }

        //上一次上传的网络时延等级
        this._lastLevel = level;
        //重置累计次数
        this._times = 0;

        let sceneName = cc.director.getScene().name;
        if(sceneName.charAt(sceneName.length - 2) === "_"){
            sceneName = sceneName.substring(0,sceneName.length-2);
        }
        this.upload({
            sUiPath: sceneName,
            sEvent: "networkLatency",
            iUserId: usrerID,
            iResult: level,
        });
    }
}
NetworkStatistics.default = new NetworkStatistics({name: "NetworkStatistics"});
module.exports = NetworkStatistics;