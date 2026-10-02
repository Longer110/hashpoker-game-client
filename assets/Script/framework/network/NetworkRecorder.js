// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-01 12:05:23
//     * @Description: 游戏网络日志对象
// ]]

let NetworkProxy = require("NetworkProxy");
let util = require("UtilManager").default;
let CMD = require('protocol');
let CONFIG = require("config_frameworks");

let TIMER_INTERVAL = 1; //(s) 循环定时器间隔
let logsMsg = [];
class NetworkRecorder extends NetworkProxy {
    _interval = TIMER_INTERVAL;
    constructor(options) {
        super(options);
        this.name = "NetworkRecorder";
        // this._debug && cc.log(`${this.name} constructor`);
    }
    onOpen(event){
        super.onOpen(event);
        this._sendCreate();
        this._startInterval();
    }
    onClose(event) {
        super.onClose(event);
        this._stopInterval();
    }
    
    upload(msg) {
        if(!msg || msg=="") return;

        let maxLength = this._uploadMaxLength();
        if(msg.length > maxLength-16){
            let tmp = msg.substr(0,maxLength-16);
            let tmp2 = msg.substring(tmp.length,msg.length);
            logsMsg.push(tmp);
            logsMsg.push(tmp2);
        }else{
            logsMsg.push(msg);
        }
    }
    _sendCreate() {
        cc.log(this.name, "_sendCreate");
        this.send(CMD.QYLOG_UPLOAD_MAIN_CMD.value,
            CMD.QYLOG_UPLOAD_MAIN_CMD.LogFileCreateReq_CMD, {
                sFileName: util.getDevicesId(),
            });
    }
    _uploadSend() {
        if (!this.isConnect()) {
            return;
        }
        if (logsMsg.length > 0) {
            let str = this._getLogStr();
            this.send(CMD.QYLOG_UPLOAD_MAIN_CMD.value,
                CMD.QYLOG_UPLOAD_MAIN_CMD.LogWriteReq_CMD, {
                    sText: str,
                });
        }
    }
    _getLogStr() {
        let str = ""
        while (logsMsg.length > 0) {
            let temp = logsMsg[0];
            let maxLength = this._uploadMaxLength();
            if (temp.length > maxLength - 16) {
                temp = temp.substr(0, maxLength - 16);
                temp = temp + "***MAXLENGTH"
            }
            if (str.length + temp.length > maxLength) {
                break;
            }
            logsMsg.shift();
            str = str + temp + "\n";
        }
        return str;
    }
    _uploadMaxLength() {
        let size = 1536;
        let maxLength = CONFIG.MAX_BUFFER_LENGTH - size;
        return maxLength;
    }
    _onInterval(){
        this._uploadSend();
    }
}

NetworkRecorder.default = new NetworkRecorder({name: "NetworkRecorder"});
module.exports = NetworkRecorder;