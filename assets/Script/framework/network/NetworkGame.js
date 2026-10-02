// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-01 12:05:23
//     * @Description: 游戏网络连接对象
// ]]

let NetworkProxy = require("NetworkProxy");
let NetworkEvent = require("NetworkEvent");


class NetworkGame extends NetworkProxy {
    constructor(options) {
        super(options);
        this.name = "NetworkGame";
        // this._debug&&cc.log(`${this.name} constructor`);
    }
    setIsEnterSubGame(value){
        cc.warn("TODO", this.name+".setIsEnterSubGame", value);
    }
    onHeartbeat(delay) {
        // this._debug && cc.log(this.name, "onHeartbeat: delay=" + delay + "(ms)");
        super.onHeartbeat(delay);
        this.emit(NetworkEvent.HEARTBEAT, delay);
    }

    updateServerConfigTime(server,time){
        for (let index = 0; index < this._servers.length; index++) {
            if (this._servers[index].HOST == server.HOST && this._servers[index].PORT == server.PORT) {
                this._servers[index].DELAYED = time;
                let url = "DELAYED_" + `${server.HEAD}://${server.HOST}:${server.PORT}`
                app.storage.setItem(url,time)
            }
        }
        // this._servers.sort((a,b)=>{
        //     return a.DELAYED - b.DELAYED;
        // })
    }

    setServerList(configs) {
        super.setServerList(configs);

        if(app.ping){
            app.ping.init();
        }
    }
}

NetworkGame.default = new NetworkGame({
    name: "NetworkGame",
    needReCreate: true,
});
module.exports = NetworkGame;