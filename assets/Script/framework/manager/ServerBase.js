// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 服务器配置基类
// ]]

let DEFAULT_TIME = 6000;
class ServerBase {
    _servers = null; //所有服务器列表
    _current = null; //当前连接的服务器
    constructor(config){
    }
    static getItemByName(server_name, server_list){
        let item = null;
        let array = server_list;
        for (let index = 0; index < array.length; index++) {
            const server = array[index];
            if (server.NAME == server_name) {
                item = server;
                break;
            }
        }
        return item;
    }
    setServer(current){
        cc.log("ServerBase", "当前使用服务器. server="+JSON.stringify(current));
        this._current = current;
    }
    getServer(){
        return this._current;
    }
    setServerList(configs){
        if(!(configs instanceof Array)){
            cc.error("ServerBase", "无效的服务器列表. params="+configs);
            configs = [];
        }
        let validList = [];
        for (let i = 0; i < configs.length; i++) {
            const item = configs[i];
            if (item && typeof item === "object" && "HEAD" in item && "HOST" in item && "PORT" in item) {
                validList.push(item);
            } else {
                cc.warn("ServerBase", "跳过无效的服务器列表项: index=" + i + " item=" + JSON.stringify(item));
            }
        }
        if (validList.length === 0) {
            validList.push({
                NAME: "默认兜底",
                HEAD: "wss",
                HOST: "game-api.hashpoker.vip",
                PORT: 50043,
            });
        }
        this._servers = validList;

        for (let index = 0; index < this._servers.length; index++) {
            let url = "DELAYED_" + `${this._servers[index].HEAD}://${this._servers[index].HOST}:${this._servers[index].PORT}`
            let time = app.storage.getItem(url,DEFAULT_TIME)
            this._servers[index].DELAYED = time;
        }
        this._servers.sort((a,b)=>{
            return a.DELAYED - b.DELAYED;
        })

    }
    //获取服务器列表（可用于自动切换网关）
    getServerList() {
        if (CC_EDITOR) {
            return [];
        }

        return this._servers;
    }
    getDefaultItem(develop) {
        if (develop) {
            return this.getDevDefaultItem("外网1");
        } else {
            return this.getReleaseDefaultItem();
        }
    }
    //开发版默认服务器
    getDevDefaultItem(server_name) {
        if (!server_name) {
            server_name = "外网1";
        }
        let array = this.getServerList();
        let item = ServerBase.getItemByName(server_name, array);
        if (!item) {
            item = this.getDelayedTimeItem();
            // let index = 0;
            // if (array.length > 1) {
            //     let max = array.length - 1;
            //     let min = 0;
            //     index = Math.floor(Math.random() * (max - min + 1) + min);
            // }
            // item = array[index];
        }
        return item;
    }

    //封测版默认服务器
    getReleaseDefaultItem(params) {
        let item = this.getDelayedTimeItem();
        return item;
    }
    //检查是否存在config配置项（避免不同项目使用了相同的key缓存了错误的IP/端口）
    checkValid(config) {
        let valid = false;
        if (!config || typeof config != 'object') {
            return valid;
        }
        let array = this.getServerList();
        for (let index = 0; index < array.length; index++) {
            const item = array[index];
            if (config.HEAD == item.HEAD && config.HOST == item.HOST && config.PORT == item.PORT) {
                valid = true;
                break;
            }
        }
        return valid;
    }
    

    //延时最低服务器
    getDelayedTimeItem(){

        let item = null;
        let array = this.getServerList() || [];
        array.sort((a,b)=>{
            return a.DELAYED - b.DELAYED;
        })

        let time = 999999
        for(let i=0;i<array.length;i++){
            if(array[i].DELAYED < time){
                time = array[i].DELAYED;
            }
        }
         //console.log("最低延迟：",time)

        if(array.length > 0){
            item = array[0];
        }else{
            item = {
                NAME: "未配置1",
                HEAD: "ws",
                HOST: "127.0.0.1",
                PORT: 10001,
            }
        }
        return item;
    }


    //随机服务器  //isPro :是否是外网
    getRandomItem(){
        return this.getDefaultItem(!app.config.ISDEVELOP);
        let item = null;
        let array = this.getServerList() || [];
        if(app.config.ISDEVELOP){
            array.forEach(e => {
                if(e.NAME=="外网"){
                    this.setBtnStatus(e, true);
                }
                else{
                    this.setBtnStatus(e, false);
                }
            });
        }
        let index = 0;
        if (array.length > 0) {
            if (array.length > 1) {
                let max = array.length - 1;
                let min = 0;
                index = Math.floor(Math.random() * (max - min + 1) + min);
            }
            item = array[index];
        } else {
            item = {
                NAME: "未配置1",
                HEAD: "ws",
                HOST: "127.0.0.1",
                PORT: 10001,
            }
        }
        return item;
    }
}

module.exports = ServerBase;
