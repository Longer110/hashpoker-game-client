// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-01 12:05:23
//     * @Description: 游戏网络数据统计对象
// ]]

let NetworkProxy = require("NetworkProxy");
class NetworkPing extends NetworkProxy {

    _idPingInterval = 0; //定时器ID
    constructor(options) {
        super(options);
        this.name = "NetworkPing";
    }

    setServer(server) {
        if(!this._server){
            this._server = server;
        }
    }
    getServer(){
        return this._server
    }
    onMessage(data){
        // super.onMessage(data);
        this._debug && cc.log(this.name, "onMessage Receive: data=", JSON.stringify(data));
        this.emit(data.msg, data.data);
    }
}
module.exports = NetworkPing;