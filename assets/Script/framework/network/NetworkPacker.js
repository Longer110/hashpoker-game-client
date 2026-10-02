// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 网络数据封包、解包
// ]]

let Request = require("request");
let Response = require("response");
let Protocol = require('protocol');

class NetworkPacker {
    _isNative = false;
    _network = null;
    constructor(network, options) {
        if(!options){
            options = {};
        }
        if(typeof options.isNative == 'boolean'){
            this._isNative = options.isNative;
        }
        this._network = network;
    }

    setSocketType(type){
        if(type == 1){ //原生socket
            this._isNative = true
        }else{//websocket
            this._isNative = false
        }
    }

    packData(mainCmd, subCmd, data){
        let packet = null;
        if(this._isNative){
            let buffer = Request.request(mainCmd, subCmd, data, true);
            if(this._network && this._network._socket){
                packet = this._network._socket.writeBuffer(mainCmd, subCmd, buffer);
            }
        }
        else{
            let buffer = Request.request(mainCmd, subCmd, data);
            packet = buffer;
        }
        return packet;
    } 
    
    unpackData(event){
        let skipHead = null;
        if (this._isNative) {
            if(typeof event.mainCmd == 'number' && typeof event.subCmd == 'number'){
                skipHead = { mainCmd: event.mainCmd, subCmd: event.subCmd}
            }
        } 
        /**
         * data = {
         *  mainCmd,
         *  subCmd,
         *  msg,
         * }
         */
        let data = Response.response(event.data, skipHead);
        return data;
    }

    //心跳
    packHeartbeat(){
        let data = null;
        let mainCmd = Protocol.HEART_BEAT_MAIN_CMD.value,
            subCmd = Protocol.HEART_BEAT_MAIN_CMD.HEART_BEAT_SUB_CMD;

        return this.packData(mainCmd, subCmd, data);
    }
    isHeartBeat(data){
        let mainCmd = data.mainCmd;
        let subCmd = data.subCmd;
        if (mainCmd == Protocol.HEART_BEAT_MAIN_CMD.value && subCmd == Protocol.HEART_BEAT_MAIN_CMD.HEART_BEAT_SUB_CMD) {
            return true;
        }
        return false;
    }
}

module.exports = NetworkPacker;