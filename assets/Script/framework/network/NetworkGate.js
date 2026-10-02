// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-01 12:05:23
//     * @Description: 游戏网络日志对象
// ]]

let NetworkProxy = require("NetworkProxy");

class NetworkGate extends NetworkProxy {
    constructor(options) {
        super(options);
        this.name = "NetworkGate";
        // this._debug&&cc.log(`${this.name} constructor`);
    }
    
    onHeartbeat(delay){
        super.onHeartbeat(delay);
    }
    onConnecting(event){
        super.onConnecting(event);
    }
    onOpen(event){
        super.onOpen(event);
    }
    onClose(event){
        super.onClose(event);
    }
    onError(event){
        super.onError(event);
    }
    onMessage(data){
        super.onMessage(data);
    }
}
NetworkGate.default = new NetworkGate(null);
module.exports = NetworkGate;